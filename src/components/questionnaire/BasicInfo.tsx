
import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

const BasicInfo = () => {
  const { data, updateData, currentStep, setCurrentStep, totalSteps } = useQuestionnaire();

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="form-step">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-groww-dark mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with some essential details about what you're looking for.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">I'm looking to</Label>
          <RadioGroup
            value={data.propertyType}
            onValueChange={(value) => updateData({ propertyType: value })}
            className="flex flex-wrap gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent" className="cursor-pointer">Rent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-base font-medium">Budget Range</Label>
            <span className="text-groww-purple font-medium">${data.budgetMin} - ${data.budgetMax}</span>
          </div>
          <div className="py-5">
            <Slider
              defaultValue={[data.budgetMin, data.budgetMax]}
              max={5000}
              min={500}
              step={100}
              onValueChange={(values) => {
                updateData({ budgetMin: values[0], budgetMax: values[1] });
              }}
            />
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Bedrooms</Label>
          <RadioGroup
            value={data.bedrooms}
            onValueChange={(value) => updateData({ bedrooms: value })}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2"
          >
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="studio" id="studio" className="sr-only" />
              <Label htmlFor="studio" className="cursor-pointer text-center w-full">Studio</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="1" id="1br" className="sr-only" />
              <Label htmlFor="1br" className="cursor-pointer text-center w-full">1 Bedroom</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="2" id="2br" className="sr-only" />
              <Label htmlFor="2br" className="cursor-pointer text-center w-full">2 Bedrooms</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="3+" id="3br" className="sr-only" />
              <Label htmlFor="3br" className="cursor-pointer text-center w-full">3+ Bedrooms</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label className="text-base font-medium">Bathrooms</Label>
          <RadioGroup
            value={data.bathrooms}
            onValueChange={(value) => updateData({ bathrooms: value })}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2"
          >
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="1" id="1ba" className="sr-only" />
              <Label htmlFor="1ba" className="cursor-pointer text-center w-full">1 Bath</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="2" id="2ba" className="sr-only" />
              <Label htmlFor="2ba" className="cursor-pointer text-center w-full">2 Baths</Label>
            </div>
            <div className="flex items-center justify-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="3+" id="3ba" className="sr-only" />
              <Label htmlFor="3ba" className="cursor-pointer text-center w-full">3+ Baths</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-6 flex justify-end">
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

export default BasicInfo;
