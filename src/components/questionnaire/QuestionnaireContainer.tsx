
import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import BasicInfo from './BasicInfo';
import LocationPreferences from './LocationPreferences';
import Preferences from './Preferences';
import Summary from './Summary';

const QuestionnaireContainer = () => {
  const { currentStep, totalSteps } = useQuestionnaire();
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo />;
      case 2:
        return <LocationPreferences />;
      case 3:
        return <Preferences />;
      case 4:
        return <Summary />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium text-groww-purple">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="progress-indicator">
          <div 
            className="progress-bar" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default QuestionnaireContainer;
