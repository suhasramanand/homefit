
import React, { createContext, useContext, useState } from 'react';

type QuestionnaireData = {
  propertyType: string;
  budgetMin: number;
  budgetMax: number;
  bedrooms: string;
  bathrooms: string;
  neighborhoods: string[];
  moveInDate: string;
  petsAllowed: boolean;
  amenities: string[];
  floorPreference: string;
  publicTransport: string;
  viewPreference: string;
};

const initialData: QuestionnaireData = {
  propertyType: 'rent',
  budgetMin: 1000,
  budgetMax: 2000,
  bedrooms: '1',
  bathrooms: '1',
  neighborhoods: [],
  moveInDate: '',
  petsAllowed: false,
  amenities: [],
  floorPreference: '',
  publicTransport: '',
  viewPreference: '',
};

type QuestionnaireContextType = {
  data: QuestionnaireData;
  updateData: (updates: Partial<QuestionnaireData>) => void;
  resetData: () => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<QuestionnaireData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
    setCurrentStep(1);
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        data,
        updateData,
        resetData,
        currentStep,
        setCurrentStep,
        totalSteps,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};
