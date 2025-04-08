
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/contexts/AuthContext';
import { Apartment, UserPreferences } from '@/types';
import { calculateMatchScore } from '@/utils/matchScoring';
import ApartmentCard from './ApartmentCard';
import { FiltersPanel } from './FiltersPanel';
import { RootState } from '@/store/store';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResultsContainerProps {
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
  sortOption: string;
  onSortChange: (option: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  bedroomFilter: string;
  onBedroomFilterChange: (value: string) => void;
  bathroomFilter: string;
  onBathroomFilterChange: (value: string) => void;
  amenityFilters: string[];
  onAmenityFilterChange: (amenity: string, checked: boolean) => void;
  onFilterReset: () => void;
}

interface ApartmentWithScore extends Apartment {
  matchScore: number;
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({
  apartments,
  isLoading,
  error,
  sortOption,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  bedroomFilter,
  onBedroomFilterChange,
  bathroomFilter,
  onBathroomFilterChange,
  amenityFilters,
  onAmenityFilterChange,
  onFilterReset
}) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const userPreferences = useSelector((state: RootState) => state.preferences.preferences) || user?.preferences;
  const [apartmentsWithScores, setApartmentsWithScores] = useState<ApartmentWithScore[]>([]);
  
  // Calculate match score for each apartment
  useEffect(() => {
    const calculateScores = async () => {
      if (!apartments || apartments.length === 0) {
        setApartmentsWithScores([]);
        return;
      }
      
      const scoredApartments = await Promise.all(apartments.map(async (apt) => {
        let score = 0;
        
        if (userPreferences) {
          score = await calculateMatchScore(apt, userPreferences as UserPreferences, dispatch);
        }
        
        return {
          ...apt,
          matchScore: score
        } as ApartmentWithScore;
      }));
      
      setApartmentsWithScores(scoredApartments);
    };
    
    calculateScores();
  }, [apartments, userPreferences, dispatch]);
  
  // Sort apartments based on the selected option
  const getSortedApartments = (apts: ApartmentWithScore[]): ApartmentWithScore[] => {
    if (!apts || apts.length === 0) return [];
    
    const sortedApts = [...apts];
    
    switch (sortOption) {
      case 'priceAsc':
        return sortedApts.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return sortedApts.sort((a, b) => b.price - a.price);
      case 'newest':
        return sortedApts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'bestMatch':
      default:
        return sortedApts.sort((a, b) => b.matchScore - a.matchScore);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-[200px] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const sortedApartments = getSortedApartments(apartmentsWithScores);
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <FiltersPanel 
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            bedroomFilter={bedroomFilter}
            onBedroomFilterChange={onBedroomFilterChange}
            bathroomFilter={bathroomFilter}
            onBathroomFilterChange={onBathroomFilterChange}
            amenityFilters={amenityFilters}
            onAmenityFilterChange={onAmenityFilterChange}
            onFilterReset={onFilterReset}
          />
        </div>
        
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {apartments.length} {apartments.length === 1 ? 'Apartment' : 'Apartments'} Found
            </h2>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Sort by:</span>
              <Select value={sortOption} onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bestMatch">Best Match</SelectItem>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {apartments.length > 0 ? (
            <div className="space-y-6">
              {sortedApartments.map((apartment) => (
                <ApartmentCard 
                  key={apartment.id} 
                  apartment={apartment} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No apartments found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters to see more results.
              </p>
              <button 
                onClick={onFilterReset}
                className="mt-4 text-white bg-groww-purple px-4 py-2 rounded-md hover:bg-groww-purple-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
