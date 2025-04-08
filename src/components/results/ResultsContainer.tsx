
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ApartmentCard from '@/components/results/ApartmentCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import gsap from 'gsap';
import { useToast } from '@/components/ui/use-toast';

interface ResultsContainerProps {
  apartments: any[];
  isLoading: boolean;
  error: string | null;
  sortOption?: string;
  onSortChange?: (option: string) => void;
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({ 
  apartments = [], 
  isLoading,
  error,
  sortOption = 'bestMatch',
  onSortChange
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 3000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(searchParams.get('bedrooms') || '');
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>(searchParams.get('bathrooms') || '');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    searchParams.get('neighborhoods')?.split(',') || []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get('amenities')?.split(',') || []
  );
  
  // Sorted apartments
  const [sortedApartments, setSortedApartments] = useState<any[]>([]);
  
  // Sort apartments
  useEffect(() => {
    if (apartments.length === 0) return;
    
    let sorted = [...apartments];
    
    switch (sortOption) {
      case 'bestMatch':
        sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    setSortedApartments(sorted);
  }, [apartments, sortOption]);
  
  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    // Header animation
    if (headerRef.current) {
      tl.fromTo(headerRef.current, 
        { opacity: 0, y: -30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
    
    // Filters animation
    if (filtersRef.current) {
      tl.fromTo(filtersRef.current, 
        { opacity: 0, x: -30 }, 
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
    }
    
    // Results animation with stagger effect
    if (resultsRef.current?.children) {
      tl.fromTo(resultsRef.current.children, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1 },
        "-=0.2"
      );
    }
  }, []);
  
  const handleBedroomSelect = (value: string) => {
    setSelectedBedrooms(value === selectedBedrooms ? '' : value);
  };
  
  const handleBathroomSelect = (value: string) => {
    setSelectedBathrooms(value === selectedBathrooms ? '' : value);
  };
  
  const handleNeighborhoodToggle = (value: string) => {
    setSelectedNeighborhoods(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  
  const handleAmenityToggle = (value: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  
  const applyFilters = () => {
    const params: any = {};
    
    if (priceRange[0] !== 1000) params.minPrice = priceRange[0].toString();
    if (priceRange[1] !== 3000) params.maxPrice = priceRange[1].toString();
    if (selectedBedrooms) params.bedrooms = selectedBedrooms;
    if (selectedBathrooms) params.bathrooms = selectedBathrooms;
    if (selectedNeighborhoods.length > 0) params.neighborhoods = selectedNeighborhoods.join(',');
    if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');
    
    setSearchParams(params);
    
    toast({
      title: "Filters Applied",
      description: "Your search filters have been updated."
    });
  };
  
  const resetFilters = () => {
    setPriceRange([1000, 3000]);
    setSelectedBedrooms('');
    setSelectedBathrooms('');
    setSelectedNeighborhoods([]);
    setSelectedAmenities([]);
    setSearchParams({});
    
    toast({
      title: "Filters Reset",
      description: "All search filters have been cleared."
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-groww-purple"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <h2 className="text-xl font-medium text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Results header */}
      <div ref={headerRef} className="mb-8">
        <h1 className="text-3xl font-bold text-groww-dark mb-2">Your Apartment Matches</h1>
        <p className="text-gray-600">
          We found {apartments.length} apartments that match your preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div ref={filtersRef} className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-groww-dark">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-groww-purple hover:text-groww-purple-dark"
                onClick={resetFilters}
              >
                Reset All
              </Button>
            </div>

            {/* Price filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">$1000</span>
                <span className="text-sm text-gray-500">$3500</span>
              </div>
              <Slider 
                value={priceRange} 
                onValueChange={setPriceRange} 
                max={4000} 
                min={500} 
                step={100} 
              />
              <div className="mt-2 flex justify-between">
                <span className="text-sm font-medium">${priceRange[0]}</span>
                <span className="text-sm font-medium">${priceRange[1]}</span>
              </div>
            </div>

            {/* Bedrooms filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <div className="flex flex-wrap gap-2">
                {['Studio', '1', '2', '3+'].map(bedroom => (
                  <Badge 
                    key={bedroom}
                    variant={selectedBedrooms === bedroom ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-groww-soft-purple"
                    onClick={() => handleBedroomSelect(bedroom)}
                  >
                    {bedroom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bathrooms filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <div className="flex flex-wrap gap-2">
                {['1', '1.5', '2', '2.5', '3+'].map(bathroom => (
                  <Badge 
                    key={bathroom}
                    variant={selectedBathrooms === bathroom ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-groww-soft-purple"
                    onClick={() => handleBathroomSelect(bathroom)}
                  >
                    {bathroom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Neighborhoods filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Neighborhoods</label>
              <div className="flex flex-wrap gap-2">
                {['Downtown', 'Midtown', 'West End', 'East Side'].map(neighborhood => (
                  <Badge 
                    key={neighborhood}
                    variant={selectedNeighborhoods.includes(neighborhood) ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-groww-soft-purple"
                    onClick={() => handleNeighborhoodToggle(neighborhood)}
                  >
                    {neighborhood}
                    {selectedNeighborhoods.includes(neighborhood) && (
                      <X 
                        className="ml-1 h-3 w-3" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNeighborhoodToggle(neighborhood);
                        }}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="space-y-2">
                {['In-unit Washer/Dryer', 'Gym', 'Pool', 'Parking', 'Pet-Friendly', 'Balcony', 'Dishwasher'].map(amenity => (
                  <div 
                    key={amenity}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleAmenityToggle(amenity)}
                  >
                    <div className={`${
                      selectedAmenities.includes(amenity) 
                        ? 'bg-groww-soft-purple' 
                        : 'border'
                    } rounded-full p-0.5 mr-2`}>
                      <Check className={`h-3 w-3 ${
                        selectedAmenities.includes(amenity) 
                          ? 'text-groww-purple' 
                          : 'text-transparent'
                      }`} />
                    </div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-groww-purple hover:bg-groww-purple-dark"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results grid */}
        <div className="lg:w-3/4">
          {/* Sort controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-3 sm:mb-0">
              <SlidersHorizontal size={18} className="text-groww-purple mr-2" />
              <span className="text-sm">Sorted by:</span>
            </div>
            <div className="w-full sm:w-48">
              <Select 
                value={sortOption} 
                onValueChange={(value) => onSortChange && onSortChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bestMatch">Best Match</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Empty state */}
          {sortedApartments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">No apartments found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Apartment cards grid */}
          <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedApartments.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
