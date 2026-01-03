import { MapPin, Bed, Bath, Maximize, Tag } from 'lucide-react';
import type { Property } from '../types/database';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
            {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white text-gray-900 text-sm font-bold rounded-lg shadow-md">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.city}, {property.country}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between text-gray-700 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <Bed className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Maximize className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">{property.area} m²</span>
          </div>
          <div className="flex items-center space-x-1">
            <Tag className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium capitalize">{property.property_type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
