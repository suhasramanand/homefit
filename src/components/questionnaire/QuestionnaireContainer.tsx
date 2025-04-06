
import React, { useEffect, useRef } from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import BasicInfo from './BasicInfo';
import LocationPreferences from './LocationPreferences';
import Preferences from './Preferences';
import Summary from './Summary';
import gsap from 'gsap';

const QuestionnaireContainer = () => {
  const { currentStep, totalSteps } = useQuestionnaire();
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
    if (contentRef.current) {
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
            ease: "back.out(1.7)"
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
  }, [currentStep, totalSteps]);
  
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
      <div ref={progressRef} className="mb-6">
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
      <div ref={contentRef}>
        {renderStep()}
      </div>
    </div>
  );
};

export default QuestionnaireContainer;
