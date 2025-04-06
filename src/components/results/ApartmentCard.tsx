
import React from 'react';
import { Apartment } from '@/utils/mockData';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ApartmentCardProps {
  apartment: Apartment;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  const formatBedrooms = (bedrooms: number) => {
    return bedrooms === 0 ? 'Studio' : `${bedrooms} bd`;
  };

  return (
    <Card className="apt-card overflow-hidden border hover:border-groww-purple transition-colors">
      <div className="relative">
        <div className="h-48 bg-gray-200 relative">
          <div className="absolute top-0 right-0 p-2">
            <div className="bg-groww-purple text-white rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm">
              {apartment.matchScore}% Match
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-groww-dark truncate">{apartment.name}</h3>
          <span className="font-bold text-groww-purple">${apartment.price}/mo</span>
        </div>
        <p className="text-gray-500 text-sm mb-3">
          {apartment.neighborhood} • {formatBedrooms(apartment.bedrooms)} • {apartment.bathrooms} ba • {apartment.sqft} sqft
        </p>
        <div className="flex flex-wrap gap-2">
          {apartment.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="bg-groww-soft-purple text-groww-purple-dark font-normal">
              {amenity}
            </Badge>
          ))}
          {apartment.amenities.length > 3 && (
            <Badge variant="outline" className="font-normal">
              +{apartment.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">Available {new Date(apartment.available).toLocaleDateString()}</span>
        <Link to={`/apartments/${apartment.id}`} className="text-sm font-medium text-groww-purple hover:text-groww-purple-dark transition-colors">
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ApartmentCard;
