
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
  
  useEffect(() => {
    // Parse filters from URL search params
    const filters = {
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      bedrooms: searchParams.get('bedrooms'),
      bathrooms: searchParams.get('bathrooms'),
      location: searchParams.get('location'),
      amenities: searchParams.get('amenities')?.split(',')
    };
    
    // Fetch apartments with filters
    dispatch(fetchApartments(filters));
  }, [dispatch, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <ResultsContainer 
          apartments={apartments}
          isLoading={status === 'loading'}
          error={error}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Results;
