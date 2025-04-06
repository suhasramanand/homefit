
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';

const Summary = () => {
  const { data, currentStep, setCurrentStep } = useQuestionnaire();
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // In a real app, we would submit the data to the backend here
    navigate('/results');
  };

  return (
    <div className="form-step">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-groww-dark mb-2">Review Your Preferences</h2>
        <p className="text-gray-600">Please confirm your preferences before we find your matches.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-groww-dark">Property Details</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Looking to <span className="font-semibold">{data.propertyType}</span>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Budget range: <span className="font-semibold">${data.budgetMin} - ${data.budgetMax}</span>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  <span className="font-semibold">{data.bedrooms}</span> bedroom(s), <span className="font-semibold">{data.bathrooms}</span> bathroom(s)
                </span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-groww-dark">Location & Move-in</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Preferred neighborhoods: <span className="font-semibold">{data.neighborhoods.length > 0 ? data.neighborhoods.join(', ') : 'Any'}</span>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Move-in date: <span className="font-semibold">{data.moveInDate ? format(new Date(data.moveInDate), 'PPP') : 'Flexible'}</span>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Pet-friendly: <span className="font-semibold">{data.petsAllowed ? 'Yes' : 'No'}</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-groww-dark">Amenities</h3>
            <ul className="mt-2 space-y-2">
              {data.amenities.length > 0 ? (
                data.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800">{amenity}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-800">No specific amenities selected</li>
              )}
            </ul>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-groww-dark">Additional Preferences</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Floor preference: <span className="font-semibold">{data.floorPreference || 'No preference'}</span>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  Public transport: <span className="font-semibold">{data.publicTransport || 'No preference'}</span>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-groww-purple mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">
                  View preference: <span className="font-semibold">{data.viewPreference || 'No preference'}</span>
                </span>
              </li>
            </ul>
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
            onClick={handleSubmit}
            className="bg-groww-purple hover:bg-groww-purple-dark text-white"
          >
            Find My Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
