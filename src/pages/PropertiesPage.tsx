import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import SearchFilters, { SearchFilters as Filters } from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/database';

interface PropertiesPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export default function PropertiesPage({ onNavigate }: PropertiesPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: Filters) => {
    let filtered = [...properties];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query)
      );
    }

    if (filters.propertyType !== 'all') {
      filtered = filtered.filter((property) => property.property_type === filters.propertyType);
    }

    if (filters.listingType !== 'all') {
      filtered = filtered.filter((property) => property.listing_type === filters.listingType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((property) => property.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((property) => property.price <= parseFloat(filters.maxPrice));
    }

    if (filters.bedrooms !== 'all') {
      filtered = filtered.filter((property) => property.bedrooms >= parseInt(filters.bedrooms));
    }

    if (filters.city) {
      const city = filters.city.toLowerCase();
      filtered = filtered.filter((property) => property.city.toLowerCase().includes(city));
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Browse Properties</h1>
          <p className="text-blue-100">
            Find your perfect home from our extensive collection
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilters onSearch={handleSearch} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredProperties.length}</span> properties
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => onNavigate('property', property.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search filters to find more properties
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
