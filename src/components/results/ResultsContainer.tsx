
import React, { useState } from 'react';
import { Apartment, generateMockApartments } from '@/utils/mockData';
import ApartmentCard from './ApartmentCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

const ResultsContainer = () => {
  const [apartments, setApartments] = useState<Apartment[]>(generateMockApartments());
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 4000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    const mockApartments = generateMockApartments();
    
    const filtered = mockApartments.filter(apartment => {
      // Filter by search term
      const matchesSearch = apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           apartment.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apartment.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by price range
      const matchesPrice = apartment.price >= priceRange[0] && apartment.price <= priceRange[1];
      
      // Filter by bedrooms
      const matchesBedrooms = selectedBedrooms === 'all' || 
        (selectedBedrooms === 'studio' && apartment.bedrooms === 0) ||
        apartment.bedrooms.toString() === selectedBedrooms;
      
      return matchesSearch && matchesPrice && matchesBedrooms;
    });
    
    setApartments(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-groww-dark mb-2">Your Apartment Matches</h1>
        <p className="text-gray-600 mb-6">
          We found {apartments.length} apartments that match your preferences.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="md:flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by neighborhood, address, or name"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={toggleFilters}
            variant="outline" 
            className="md:w-auto"
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
          </Button>
          <Button 
            onClick={applyFilters}
            className="bg-groww-purple hover:bg-groww-purple-dark text-white"
          >
            Apply Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 p-6 bg-white rounded-xl shadow-sm border border-border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">${priceRange[0]}</span>
                <span className="text-sm text-gray-500">${priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={priceRange}
                max={5000}
                min={500}
                step={100}
                onValueChange={(values) => setPriceRange([values[0], values[1]])}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="All bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All bedrooms</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional filters can be added here */}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
