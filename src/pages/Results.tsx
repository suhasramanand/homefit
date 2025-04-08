
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchApartments } from '@/store/slices/apartmentsSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResultsContainer from '@/components/results/ResultsContainer';

const Results = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { apartments, status, error } = useAppSelector(state => state.apartments);
  const [sortOption, setSortOption] = useState('bestMatch'); // Default sort option
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [bedroomFilter, setBedroomFilter] = useState<string>('');
  const [bathroomFilter, setBathroomFilter] = useState<string>('');
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [filteredApartments, setFilteredApartments] = useState(apartments);
  
  // Parse filters from URL search params
  useEffect(() => {
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') || '0') : 0;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') || '10000') : 10000;
    setPriceRange([minPrice, maxPrice]);
    
    const bedrooms = searchParams.get('bedrooms') || '';
    setBedroomFilter(bedrooms);
    
    const bathrooms = searchParams.get('bathrooms') || '';
    setBathroomFilter(bathrooms);
    
    const amenities = searchParams.get('amenities')?.split(',') || [];
    setAmenityFilters(amenities);
    
    // Fetch apartments with filters
    const filters = {
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      bedrooms: searchParams.get('bedrooms'),
      bathrooms: searchParams.get('bathrooms'),
      location: searchParams.get('location'),
      amenities: searchParams.get('amenities')?.split(',')
    };
    
    dispatch(fetchApartments(filters));
  }, [dispatch, searchParams]);
  
  // Filter and sort apartments when they change or when filter/sort options change
  useEffect(() => {
    let result = [...apartments];
    
    // Apply price filter
    result = result.filter(apt => 
      apt.price >= priceRange[0] && apt.price <= priceRange[1]
    );
    
    // Apply bedroom filter if selected
    if (bedroomFilter) {
      result = result.filter(apt => 
        bedroomFilter === '4+' 
          ? apt.bedrooms >= 4 
          : apt.bedrooms === parseInt(bedroomFilter)
      );
    }
    
    // Apply bathroom filter if selected
    if (bathroomFilter) {
      result = result.filter(apt => 
        bathroomFilter === '3+' 
          ? apt.bathrooms >= 3 
          : apt.bathrooms === parseInt(bathroomFilter)
      );
    }
    
    // Apply amenity filters if any selected
    if (amenityFilters.length > 0) {
      result = result.filter(apt => 
        amenityFilters.every(amenity => apt.amenities?.includes(amenity))
      );
    }
    
    // Sort the apartments
    result = sortApartments(result, sortOption);
    
    setFilteredApartments(result);
  }, [apartments, sortOption, priceRange, bedroomFilter, bathroomFilter, amenityFilters]);
  
  const sortApartments = (apts: any[], sortBy: string) => {
    switch (sortBy) {
      case 'priceAsc':
        return [...apts].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...apts].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...apts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'bestMatch':
      default:
        // Best match uses the matchScore calculated in the ResultsContainer
        return apts;
    }
  };
  
  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
  };
  
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };
  
  const handleBedroomFilterChange = (value: string) => {
    setBedroomFilter(value);
  };
  
  const handleBathroomFilterChange = (value: string) => {
    setBathroomFilter(value);
  };
  
  const handleAmenityFilterChange = (amenity: string, isChecked: boolean) => {
    if (isChecked) {
      setAmenityFilters(prev => [...prev, amenity]);
    } else {
      setAmenityFilters(prev => prev.filter(a => a !== amenity));
    }
  };
  
  const handleFilterReset = () => {
    setPriceRange([0, 10000]);
    setBedroomFilter('');
    setBathroomFilter('');
    setAmenityFilters([]);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <ResultsContainer 
          apartments={filteredApartments}
          isLoading={status === 'loading'}
          error={error}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          bedroomFilter={bedroomFilter}
          onBedroomFilterChange={handleBedroomFilterChange}
          bathroomFilter={bathroomFilter}
          onBathroomFilterChange={handleBathroomFilterChange}
          amenityFilters={amenityFilters}
          onAmenityFilterChange={handleAmenityFilterChange}
          onFilterReset={handleFilterReset}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Results;
