
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FiltersPanelProps {
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

const commonAmenities = [
  'Air Conditioning',
  'Dishwasher',
  'Washer/Dryer',
  'Parking',
  'Gym',
  'Pool',
  'Pet Friendly',
  'Balcony',
  'Elevator',
  'Furnished',
];

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  priceRange,
  onPriceRangeChange,
  bedroomFilter,
  onBedroomFilterChange,
  bathroomFilter,
  onBathroomFilterChange,
  amenityFilters,
  onAmenityFilterChange,
  onFilterReset,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onFilterReset}
        >
          Reset All
        </Button>
      </div>
      
      <Accordion type="multiple" defaultValue={['price', 'bedrooms', 'bathrooms', 'amenities']}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider 
                min={0} 
                max={10000} 
                step={100}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              />
              <div className="flex justify-between">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="bedrooms">
          <AccordionTrigger>Bedrooms</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {['', '1', '2', '3', '4+'].map((value) => (
                <Button 
                  key={value || 'any'} 
                  variant={bedroomFilter === value ? "default" : "outline"}
                  size="sm"
                  className="justify-center"
                  onClick={() => onBedroomFilterChange(value)}
                >
                  {value || 'Any'}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="bathrooms">
          <AccordionTrigger>Bathrooms</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {['', '1', '2', '3+'].map((value) => (
                <Button 
                  key={value || 'any'} 
                  variant={bathroomFilter === value ? "default" : "outline"}
                  size="sm"
                  className="justify-center"
                  onClick={() => onBathroomFilterChange(value)}
                >
                  {value || 'Any'}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="amenities">
          <AccordionTrigger>Amenities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {commonAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity}`}
                    checked={amenityFilters.includes(amenity)}
                    onCheckedChange={(checked) => 
                      onAmenityFilterChange(amenity, checked === true)
                    }
                  />
                  <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
