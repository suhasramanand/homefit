
import React, { useRef } from 'react';
import { Apartment } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

interface ApartmentCardProps {
  apartment: Apartment & { matchScore?: number };
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const formatBedrooms = (bedrooms: number) => {
    return bedrooms === 0 ? 'Studio' : `${bedrooms} bd`;
  };

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      borderColor: "#9b87f5",
      duration: 0.3
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "",
      duration: 0.3
    });
  };

  return (
    <Card 
      ref={cardRef} 
      className="apt-card overflow-hidden border hover:border-groww-purple transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/apartments/${apartment.id}`}>
        <div className="relative">
          <div className="h-48 bg-gray-200 relative">
            {apartment.matchScore !== undefined && (
              <div className="absolute top-0 right-0 p-2">
                <div className="bg-groww-purple text-white rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm">
                  {apartment.matchScore}% Match
                </div>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg text-groww-dark truncate">{apartment.title}</h3>
            <span className="font-bold text-groww-purple">${apartment.price}/mo</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">
            {apartment.neighborhood || apartment.location} • {formatBedrooms(apartment.bedrooms)} • {apartment.bathrooms} ba • {apartment.squareFeet} sqft
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
          <span className="text-sm text-gray-500">Available: {new Date().toLocaleDateString()}</span>
          <span className="text-sm font-medium text-groww-purple hover:text-groww-purple-dark transition-colors">
            View Details
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ApartmentCard;
