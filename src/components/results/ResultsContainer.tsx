
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Apartment } from '@/types';
import { Link } from 'react-router-dom';
import { calculateMatchScore } from '@/utils/matchScoring';
import ApartmentCard from './ApartmentCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  ArrowDownAZ, 
  SortAsc, 
  SortDesc,
  X, 
  Check,
  CalendarClock, 
  Hotel,
  Bath
} from 'lucide-react';
import { 
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultsContainerProps {
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
  sortOption: string;
  onSortChange: (sortOption: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  bedroomFilter: string;
  onBedroomFilterChange: (value: string) => void;
  bathroomFilter: string;
  onBathroomFilterChange: (value: string) => void;
  amenityFilters: string[];
  onAmenityFilterChange: (amenity: string, isChecked: boolean) => void;
  onFilterReset: () => void;
}

const amenitiesList = [
  'Gym', 
  'Pool', 
  'Parking', 
  'Balcony', 
  'Dishwasher', 
  'Air Conditioning',
  'Washer/Dryer',
  'Pet Friendly',
  'Elevator',
  'Doorman',
  'Furnished'
];

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
  const dispatch = useAppDispatch();
  const userPreferences = useAppSelector(state => state.preferences);
  const [scoredApartments, setScoredApartments] = useState<any[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);
  
  // Calculate match scores when apartments or preferences change
  useEffect(() => {
    const calculateScores = async () => {
      if (!apartments.length) return;
      
      // Calculate match scores for each apartment
      const scoredApts = await Promise.all(
        apartments.map(async (apt) => {
          const score = await calculateMatchScore(apt, userPreferences, dispatch);
          return { ...apt, matchScore: score };
        })
      );
      
      // Sort apartments based on the selected sort option
      let sortedApartments = [...scoredApts];
      
      switch (sortOption) {
        case 'priceAsc':
          sortedApartments = sortedApartments.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          sortedApartments = sortedApartments.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          sortedApartments = sortedApartments.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'bestMatch':
        default:
          sortedApartments = sortedApartments.sort((a, b) => b.matchScore - a.matchScore);
          break;
      }
      
      setScoredApartments(sortedApartments);
      setFilteredCount(sortedApartments.length);
    };
    
    calculateScores();
  }, [apartments, sortOption, userPreferences, dispatch]);
  
  const handleSortSelect = (value: string) => {
    onSortChange(value);
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    setLocalPriceRange(value as [number, number]);
  };
  
  const applyPriceRange = () => {
    onPriceRangeChange(localPriceRange);
  };
  
  const handleCheckboxChange = (amenity: string, checked: boolean) => {
    onAmenityFilterChange(amenity, checked);
  };
  
  const getFilterCount = () => {
    let count = 0;
    if (bedroomFilter) count++;
    if (bathroomFilter) count++;
    if (amenityFilters.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
    return count;
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">Searching apartments...</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Apartments</h2>
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // No results state
  if (apartments.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4">No apartments found</h2>
          <p className="text-gray-600 mb-8">Try adjusting your search criteria or exploring other neighborhoods.</p>
          <Button asChild>
            <Link to="/questionnaire">Update Preferences</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Apartments for You</h1>
          <p className="text-gray-600">
            Found {filteredCount} {filteredCount === 1 ? 'apartment' : 'apartments'} that match your criteria
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Select value={sortOption} onValueChange={handleSortSelect}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort Options</SelectLabel>
                <SelectItem value="bestMatch">Best Match</SelectItem>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {getFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-groww-purple text-white">
                    {getFilterCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Filter Apartments</SheetTitle>
                <SheetDescription>
                  Narrow down your apartment search with these filters.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-8">
                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={localPriceRange}
                      onValueChange={handlePriceRangeChange}
                      onValueCommit={applyPriceRange}
                      className="mb-6"
                    />
                    <div className="flex justify-between">
                      <div className="text-sm">
                        <div className="text-gray-500">Min</div>
                        <div className="font-medium">{formatPrice(localPriceRange[0])}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500">Max</div>
                        <div className="font-medium">{formatPrice(localPriceRange[1])}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bedrooms Filter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Bedrooms</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['Any', '1', '2', '3', '4+'].map((value) => (
                      <Button 
                        key={value} 
                        variant={bedroomFilter === (value === 'Any' ? '' : value) ? "default" : "outline"}
                        onClick={() => onBedroomFilterChange(value === 'Any' ? '' : value)}
                        className="w-full"
                      >
                        <Hotel className="h-4 w-4 mr-1" />
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Bathrooms Filter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Bathrooms</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['Any', '1', '2', '3+'].map((value) => (
                      <Button 
                        key={value} 
                        variant={bathroomFilter === (value === 'Any' ? '' : value) ? "default" : "outline"}
                        onClick={() => onBathroomFilterChange(value === 'Any' ? '' : value)}
                        className="w-full"
                      >
                        <Bath className="h-4 w-4 mr-1" />
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Amenities Filter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity}`}
                          checked={amenityFilters.includes(amenity)}
                          onCheckedChange={(checked) => handleCheckboxChange(amenity, checked === true)}
                        />
                        <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="mt-8">
                <Button variant="outline" onClick={onFilterReset}>
                  <X className="h-4 w-4 mr-1" /> Reset Filters
                </Button>
                <SheetClose asChild>
                  <Button>
                    <Check className="h-4 w-4 mr-1" /> Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Active filters display */}
      {getFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {priceRange[0] > 0 || priceRange[1] < 10000 ? (
            <Badge variant="outline" className="px-3 py-1">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              <button 
                onClick={() => onPriceRangeChange([0, 10000])} 
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null}
          
          {bedroomFilter && (
            <Badge variant="outline" className="px-3 py-1">
              {bedroomFilter === '4+' ? '4+ Bedrooms' : `${bedroomFilter} Bedroom${bedroomFilter === '1' ? '' : 's'}`}
              <button 
                onClick={() => onBedroomFilterChange('')} 
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {bathroomFilter && (
            <Badge variant="outline" className="px-3 py-1">
              {bathroomFilter === '3+' ? '3+ Bathrooms' : `${bathroomFilter} Bathroom${bathroomFilter === '1' ? '' : 's'}`}
              <button 
                onClick={() => onBathroomFilterChange('')} 
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {amenityFilters.map(amenity => (
            <Badge key={amenity} variant="outline" className="px-3 py-1">
              {amenity}
              <button 
                onClick={() => onAmenityFilterChange(amenity, false)} 
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {getFilterCount() > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onFilterReset}
              className="text-sm font-normal h-8"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
      
      {/* Apartments grid */}
      {filteredCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoredApartments.map(apartment => (
            <ApartmentCard 
              key={apartment.id} 
              apartment={apartment} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No apartments match your filters</h2>
          <p className="text-gray-600 mb-8">Try adjusting your filter criteria to see more results.</p>
          <Button onClick={onFilterReset}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultsContainer;
