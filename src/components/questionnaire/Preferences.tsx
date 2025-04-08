
import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface PreferencesProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ onNextStep, onPrevStep }) => {
  const { data, updateData } = useQuestionnaire();
  
  const amenities = [
    { id: 'washer-dryer', label: 'In-unit Washer/Dryer' },
    { id: 'dishwasher', label: 'Dishwasher' },
    { id: 'central-ac', label: 'Central Air Conditioning' },
    { id: 'balcony', label: 'Balcony/Patio' },
    { id: 'pool', label: 'Pool' },
    { id: 'gym', label: 'Gym/Fitness Center' },
    { id: 'parking', label: 'Parking Included' },
    { id: 'pet-friendly', label: 'Pet Friendly' },
    { id: 'doorman', label: 'Doorman' },
    { id: 'elevator', label: 'Elevator' },
    { id: 'furnished', label: 'Furnished Option' },
    { id: 'hardwood', label: 'Hardwood Floors' }
  ];
  
  const handleAmenityChange = (amenity: string) => {
    updateData({
      amenities: data.amenities.includes(amenity)
        ? data.amenities.filter(a => a !== amenity)
        : [...data.amenities, amenity]
    });
  };
  
  const handlePetChange = (value: boolean) => {
    updateData({ petsAllowed: value });
  };
  
  const handleFloorPreferenceChange = (value: string) => {
    updateData({ floorPreference: value });
  };
  
  const handlePublicTransportChange = (value: string) => {
    updateData({ publicTransport: value });
  };
  
  const handleViewPreferenceChange = (value: string) => {
    updateData({ viewPreference: value });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-6">Tell us about your preferences</h2>
        
        {/* Amenities */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Which amenities are most important to you?</h3>
          <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={amenity.id} 
                  checked={data.amenities.includes(amenity.label)}
                  onCheckedChange={() => handleAmenityChange(amenity.label)}
                  className="data-[state=checked]:bg-groww-purple data-[state=checked]:border-groww-purple"
                />
                <label
                  htmlFor={amenity.id}
                  className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {amenity.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pets */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Do you have pets?</h3>
          <RadioGroup 
            value={data.petsAllowed ? "yes" : "no"} 
            onValueChange={(v) => handlePetChange(v === "yes")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pets-yes" />
              <Label htmlFor="pets-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pets-no" />
              <Label htmlFor="pets-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Floor Preference */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Any floor preference?</h3>
          <RadioGroup 
            value={data.floorPreference} 
            onValueChange={handleFloorPreferenceChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {['Lower floor', 'Middle floor', 'Higher floor', 'No preference'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`floor-${option}`} />
                <Label htmlFor={`floor-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Public Transport */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">How important is access to public transportation?</h3>
          <RadioGroup 
            value={data.publicTransport} 
            onValueChange={handlePublicTransportChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {[
              'Essential - within 5 min walk',
              'Important - within 10 min walk',
              'Nice to have - within 15 min walk',
              'Not important'
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`transport-${option}`} />
                <Label htmlFor={`transport-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* View Preference */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-4">Any preference for the view?</h3>
          <RadioGroup 
            value={data.viewPreference} 
            onValueChange={handleViewPreferenceChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {[
              'City skyline', 
              'Park/Garden', 
              'Water view', 
              'Street view', 
              'Courtyard', 
              'No preference'
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`view-${option}`} />
                <Label htmlFor={`view-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button
          onClick={onPrevStep}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button
          onClick={onNextStep}
          className="bg-groww-purple hover:bg-groww-purple-dark flex items-center gap-2"
        >
          Continue
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Preferences;
