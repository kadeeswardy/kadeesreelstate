export interface Database {
  public: {
    Tables: {
      agents: {
        Row: Agent;
        Insert: Omit<Agent, 'id' | 'created_at'>;
        Update: Partial<Omit<Agent, 'id' | 'created_at'>>;
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;
      };
      property_images: {
        Row: PropertyImage;
        Insert: Omit<PropertyImage, 'id' | 'created_at'>;
        Update: Partial<Omit<PropertyImage, 'id' | 'created_at'>>;
      };
      inquiries: {
        Row: Inquiry;
        Insert: Omit<Inquiry, 'id' | 'created_at'>;
        Update: Partial<Omit<Inquiry, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  bio: string;
  created_at: string;
}

export interface Property {
  id: string;
  agent_id: string | null;
  title: string;
  description: string;
  property_type: string;
  listing_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  features: string[];
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export interface Inquiry {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export interface PropertyWithAgent extends Property {
  agents: Agent | null;
}
