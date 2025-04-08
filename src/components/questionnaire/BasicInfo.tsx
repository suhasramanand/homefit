
import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Home, Building, DollarSign, Bed } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface BasicInfoProps {
  onNextStep: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onNextStep }) => {
  const { data, updateData } = useQuestionnaire();
  
  const handlePropertyTypeChange = (value: string) => {
    updateData({ propertyType: value });
  };
  
  const handleBudgetChange = (values: number[]) => {
    if (values.length === 2) {
      updateData({ 
        budgetMin: values[0],
        budgetMax: values[1]
      });
    }
  };
  
  const handleBedroomsChange = (value: string) => {
    updateData({ bedrooms: value });
  };
  
  const handleBathroomsChange = (value: string) => {
    updateData({ bathrooms: value });
  };
  
  const isDisabled = () => {
    return !data.propertyType || !data.bedrooms || !data.bathrooms;
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-6">Let's get to know your basic preferences</h2>
        
        {/* Property Type */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">What are you looking for?</h3>
          <RadioGroup 
            value={data.propertyType} 
            onValueChange={handlePropertyTypeChange}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem 
                value="rent" 
                id="rent" 
                className="peer sr-only" 
              />
              <Label
                htmlFor="rent"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-groww-soft-purple peer-data-[state=checked]:border-groww-purple [&:has([data-state=checked])]:border-groww-purple cursor-pointer"
              >
                <Home className="mb-3 h-6 w-6 text-groww-purple" />
                <span>Rent</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem 
                value="buy" 
                id="buy" 
                className="peer sr-only" 
              />
              <Label
                htmlFor="buy"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-groww-soft-purple peer-data-[state=checked]:border-groww-purple [&:has([data-state=checked])]:border-groww-purple cursor-pointer"
              >
                <Building className="mb-3 h-6 w-6 text-groww-purple" />
                <span>Buy</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Budget */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            <DollarSign className="inline-block h-5 w-5 mr-1 text-groww-purple" />
            What's your budget?
          </h3>
          <div className="px-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">$500</span>
              <span className="text-sm text-gray-500">$5,000+</span>
            </div>
            <Slider
              value={[data.budgetMin, data.budgetMax]}
              onValueChange={handleBudgetChange}
              min={500}
              max={5000}
              step={100}
              className="mb-4"
            />
            <div className="flex justify-between items-center">
              <div className="bg-gray-100 px-3 py-1 rounded-md">
                <span className="text-sm font-medium">Min: ${data.budgetMin}</span>
              </div>
              <div className="h-px w-8 bg-gray-300"></div>
              <div className="bg-gray-100 px-3 py-1 rounded-md">
                <span className="text-sm font-medium">Max: ${data.budgetMax}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bedrooms */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            <Bed className="inline-block h-5 w-5 mr-1 text-groww-purple" />
            How many bedrooms?
          </h3>
          <RadioGroup 
            value={data.bedrooms} 
            onValueChange={handleBedroomsChange}
            className="grid grid-cols-5 gap-3"
          >
            {['Studio', '1', '2', '3', '4+'].map((option) => (
              <div key={option}>
                <RadioGroupItem 
                  value={option} 
                  id={`bedroom-${option}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`bedroom-${option}`}
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-3 hover:bg-gray-50 hover:border-groww-soft-purple peer-data-[state=checked]:border-groww-purple [&:has([data-state=checked])]:border-groww-purple cursor-pointer text-center"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Bathrooms */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-4">How many bathrooms?</h3>
          <RadioGroup 
            value={data.bathrooms} 
            onValueChange={handleBathroomsChange}
            className="grid grid-cols-5 gap-3"
          >
            {['1', '1.5', '2', '2.5', '3+'].map((option) => (
              <div key={option}>
                <RadioGroupItem 
                  value={option} 
                  id={`bathroom-${option}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`bathroom-${option}`}
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-3 hover:bg-gray-50 hover:border-groww-soft-purple peer-data-[state=checked]:border-groww-purple [&:has([data-state=checked])]:border-groww-purple cursor-pointer text-center"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-gray-500">
          Step 1 of 4
        </div>
        <Button
          onClick={onNextStep}
          disabled={isDisabled()}
          className="bg-groww-purple hover:bg-groww-purple-dark"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BasicInfo;
