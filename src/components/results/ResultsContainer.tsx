
import React, { useEffect, useRef } from 'react';
import { mockApartments } from '@/utils/mockData';
import ApartmentCard from '@/components/results/ApartmentCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import gsap from 'gsap';

const ResultsContainer = () => {
  const apartments = mockApartments;
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    // Header animation
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: -30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    // Filters animation
    tl.fromTo(filtersRef.current, 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );
    
    // Results animation with stagger effect
    tl.fromTo(resultsRef.current?.children, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1 },
      "-=0.2"
    );
  }, []);

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
              <Button variant="ghost" size="sm" className="text-groww-purple hover:text-groww-purple-dark">
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
              <Slider defaultValue={[1000, 3000]} max={4000} min={500} step={100} />
              <div className="mt-2 flex justify-between">
                <span className="text-sm font-medium">$1000</span>
                <span className="text-sm font-medium">$3000</span>
              </div>
            </div>

            {/* Bedrooms filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">Studio</Badge>
                <Badge className="cursor-pointer bg-groww-purple">1</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">2</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">3+</Badge>
              </div>
            </div>

            {/* Bathrooms filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">1</Badge>
                <Badge className="cursor-pointer bg-groww-purple">2</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">3+</Badge>
              </div>
            </div>

            {/* Neighborhoods filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Neighborhoods</label>
              <div className="flex flex-wrap gap-2">
                <Badge className="cursor-pointer bg-groww-purple">Downtown <X className="ml-1 h-3 w-3" /></Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">Midtown</Badge>
                <Badge className="cursor-pointer bg-groww-purple">West End <X className="ml-1 h-3 w-3" /></Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-groww-soft-purple">East Side</Badge>
              </div>
            </div>

            {/* Amenities filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-groww-soft-purple rounded-full p-0.5 mr-2">
                    <Check className="h-3 w-3 text-groww-purple" />
                  </div>
                  <span className="text-sm">In-unit Washer/Dryer</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-groww-soft-purple rounded-full p-0.5 mr-2">
                    <Check className="h-3 w-3 text-groww-purple" />
                  </div>
                  <span className="text-sm">Gym</span>
                </div>
                <div className="flex items-center">
                  <div className="border rounded-full p-0.5 mr-2">
                    <Check className="h-3 w-3 text-transparent" />
                  </div>
                  <span className="text-sm">Pool</span>
                </div>
                <div className="flex items-center">
                  <div className="border rounded-full p-0.5 mr-2">
                    <Check className="h-3 w-3 text-transparent" />
                  </div>
                  <span className="text-sm">Parking</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-groww-purple hover:bg-groww-purple-dark">
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
              <Select defaultValue="match">
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Apartment cards grid */}
          <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apartments.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;
