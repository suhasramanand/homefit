
import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const amenities = [
  'In-unit Washer/Dryer', 
  'Gym', 
  'Pool', 
  'Parking',
  'Balcony',
  'Doorman',
  'Elevator',
  'Furnished',
  'Air Conditioning'
];

const Preferences = () => {
  const { data, updateData, currentStep, setCurrentStep } = useQuestionnaire();

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...data.amenities, amenity]
      : data.amenities.filter((a) => a !== amenity);
    
    updateData({ amenities: updatedAmenities });
  };

  return (
    <div className="form-step">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-groww-dark mb-2">Preferences</h2>
        <p className="text-gray-600">Tell us more about your apartment preferences to find your perfect match.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Must-Have Amenities</Label>
          <p className="text-sm text-muted-foreground mt-1 mb-3">Select all amenities you require.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {amenities.map((amenity) => (
              <div 
                key={amenity}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer"
              >
                <Checkbox 
                  id={`amenity-${amenity}`} 
                  checked={data.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked === true)}
                />
                <Label 
                  htmlFor={`amenity-${amenity}`} 
                  className="cursor-pointer w-full"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Floor Preference</Label>
          <RadioGroup
            value={data.floorPreference}
            onValueChange={(value) => updateData({ floorPreference: value })}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
          >
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="ground" id="ground" className="sr-only" />
              <Label htmlFor="ground" className="cursor-pointer text-center w-full">Ground Floor</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="middle" id="middle" className="sr-only" />
              <Label htmlFor="middle" className="cursor-pointer text-center w-full">Middle Floor</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="top" id="top" className="sr-only" />
              <Label htmlFor="top" className="cursor-pointer text-center w-full">Top Floor</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium">Public Transportation Importance</Label>
          <RadioGroup
            value={data.publicTransport}
            onValueChange={(value) => updateData({ publicTransport: value })}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
          >
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="not-important" id="not-important" className="sr-only" />
              <Label htmlFor="not-important" className="cursor-pointer text-center w-full">Not Important</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="somewhat" id="somewhat" className="sr-only" />
              <Label htmlFor="somewhat" className="cursor-pointer text-center w-full">Somewhat Important</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="very-important" id="very-important" className="sr-only" />
              <Label htmlFor="very-important" className="cursor-pointer text-center w-full">Very Important</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium">View Preference</Label>
          <RadioGroup
            value={data.viewPreference}
            onValueChange={(value) => updateData({ viewPreference: value })}
            className="grid grid-cols-2 gap-3 mt-2"
          >
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="city" id="city" className="sr-only" />
              <Label htmlFor="city" className="cursor-pointer text-center w-full">City View</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="park" id="park" className="sr-only" />
              <Label htmlFor="park" className="cursor-pointer text-center w-full">Park View</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="water" id="water" className="sr-only" />
              <Label htmlFor="water" className="cursor-pointer text-center w-full">Water View</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="not-important" id="view-not-important" className="sr-only" />
              <Label htmlFor="view-not-important" className="cursor-pointer text-center w-full">Not Important</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-6 flex justify-between">
          <Button 
            onClick={handlePrevious}
            variant="outline"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-groww-purple hover:bg-groww-purple-dark text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
