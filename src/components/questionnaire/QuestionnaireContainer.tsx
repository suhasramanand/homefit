
import React, { useEffect, useRef, useState } from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import BasicInfo from './BasicInfo';
import LocationPreferences from './LocationPreferences';
import Preferences from './Preferences';
import Summary from './Summary';
import gsap from 'gsap';

// Define the prop types for each step component
interface StepProps {
  onNextStep: () => void;
  onPrevStep?: () => void;
}

const QuestionnaireContainer = () => {
  const { currentStep, totalSteps, setCurrentStep } = useQuestionnaire();
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      progressRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );

    // Content animation
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.1 }
    );
  }, []);

  // Animation for step changes
  useEffect(() => {
    if (contentRef.current && !animating) {
      setAnimating(true);
      
      // First fade out
      gsap.to(contentRef.current, {
        opacity: 0, 
        y: -10, 
        duration: 0.2,
        onComplete: () => {
          // Then fade in
          gsap.to(contentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            onComplete: () => {
              setAnimating(false);
            }
          });
        }
      });

      // Animate progress bar
      gsap.to('.progress-bar', {
        width: `${(currentStep / totalSteps) * 100}%`,
        duration: 0.6,
        ease: "power3.inOut"
      });
    }
  }, [currentStep, totalSteps, animating]);
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo onNextStep={goToNextStep} />;
      case 2:
        return <LocationPreferences onNextStep={goToNextStep} onPrevStep={goToPrevStep} />;
      case 3:
        return <Preferences onNextStep={goToNextStep} onPrevStep={goToPrevStep} />;
      case 4:
        return <Summary onPrevStep={goToPrevStep} />;
      default:
        return <BasicInfo onNextStep={goToNextStep} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div ref={progressRef} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium text-groww-purple">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="progress-bar bg-groww-purple h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      <div ref={contentRef} className={`transition-all duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        {renderStep()}
      </div>
    </div>
  );
};

export default QuestionnaireContainer;
