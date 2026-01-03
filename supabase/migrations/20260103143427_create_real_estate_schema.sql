/*
  # Real Estate Platform Database Schema

  1. New Tables
    - `agents`
      - `id` (uuid, primary key) - Unique identifier for each agent
      - `name` (text) - Agent full name
      - `email` (text, unique) - Agent email address
      - `phone` (text) - Contact phone number
      - `avatar_url` (text) - Profile picture URL
      - `bio` (text) - Agent biography
      - `created_at` (timestamptz) - Record creation timestamp

    - `properties`
      - `id` (uuid, primary key) - Unique identifier for each property
      - `agent_id` (uuid, foreign key) - Reference to agent
      - `title` (text) - Property title
      - `description` (text) - Detailed description
      - `property_type` (text) - Type: apartment, villa, house, etc.
      - `listing_type` (text) - For sale or rent
      - `price` (numeric) - Property price
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (integer) - Number of bathrooms
      - `area` (numeric) - Area in square meters
      - `address` (text) - Full address
      - `city` (text) - City name
      - `country` (text) - Country name
      - `latitude` (numeric) - GPS latitude
      - `longitude` (numeric) - GPS longitude
      - `image_url` (text) - Main property image
      - `features` (jsonb) - Additional features array
      - `status` (text) - available, sold, rented
      - `featured` (boolean) - Featured property flag
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `property_images`
      - `id` (uuid, primary key) - Unique identifier
      - `property_id` (uuid, foreign key) - Reference to property
      - `image_url` (text) - Image URL
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Record creation timestamp

    - `inquiries`
      - `id` (uuid, primary key) - Unique identifier
      - `property_id` (uuid, foreign key) - Reference to property
      - `name` (text) - Inquirer name
      - `email` (text) - Inquirer email
      - `phone` (text) - Contact phone
      - `message` (text) - Inquiry message
      - `status` (text) - new, contacted, closed
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Public read access for agents and properties
    - Public insert access for inquiries
    - Authenticated users can manage their own data
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  property_type text NOT NULL DEFAULT 'apartment',
  listing_type text NOT NULL DEFAULT 'sale',
  price numeric NOT NULL,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  area numeric NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'Egypt',
  latitude numeric,
  longitude numeric,
  image_url text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'available',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agents table
CREATE POLICY "Anyone can view agents"
  ON agents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update own agent profile"
  ON agents FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for properties table
CREATE POLICY "Anyone can view available properties"
  ON properties FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for property_images table
CREATE POLICY "Anyone can view property images"
  ON property_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert property images"
  ON property_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property images"
  ON property_images FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for inquiries table
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inquiry status"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
