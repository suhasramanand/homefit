
import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const neighborhoods = [
  'Downtown', 
  'Midtown', 
  'Uptown', 
  'West End', 
  'East Side', 
  'North Hills', 
  'South Bay',
  'Riverside'
];

const LocationPreferences = () => {
  const { data, updateData, currentStep, setCurrentStep } = useQuestionnaire();
  const [date, setDate] = React.useState<Date | undefined>(data.moveInDate ? new Date(data.moveInDate) : undefined);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateData({ moveInDate: selectedDate.toISOString() });
    }
  };

  const handleNeighborhoodChange = (neighborhood: string, checked: boolean) => {
    const updatedNeighborhoods = checked
      ? [...data.neighborhoods, neighborhood]
      : data.neighborhoods.filter((n) => n !== neighborhood);
    
    updateData({ neighborhoods: updatedNeighborhoods });
  };

  return (
    <div className="form-step">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-groww-dark mb-2">Location & Move-in</h2>
        <p className="text-gray-600">Tell us where you want to live and when you plan to move.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Preferred Neighborhoods</Label>
          <p className="text-sm text-muted-foreground mt-1 mb-3">Select all neighborhoods you would consider.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {neighborhoods.map((neighborhood) => (
              <div 
                key={neighborhood}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer"
              >
                <Checkbox 
                  id={`neighborhood-${neighborhood}`} 
                  checked={data.neighborhoods.includes(neighborhood)}
                  onCheckedChange={(checked) => handleNeighborhoodChange(neighborhood, checked === true)}
                />
                <Label 
                  htmlFor={`neighborhood-${neighborhood}`} 
                  className="cursor-pointer w-full"
                >
                  {neighborhood}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Move-in Date</Label>
          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select your move-in date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="text-base font-medium">Pets Allowed</Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="pets-allowed" 
              checked={data.petsAllowed} 
              onCheckedChange={(checked) => updateData({ petsAllowed: checked })} 
            />
            <Label htmlFor="pets-allowed">
              {data.petsAllowed ? 'Yes, I need pet-friendly housing' : 'No, I don\'t need pet-friendly housing'}
            </Label>
          </div>
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

export default LocationPreferences;
