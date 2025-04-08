
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import gsap from 'gsap';

interface SummaryProps {
  onPrevStep: () => void;
}

const Summary: React.FC<SummaryProps> = () => {
  const { data, currentStep, setCurrentStep } = useQuestionnaire();
  const navigate = useNavigate();
  const summaryRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Title animation
    gsap.fromTo(summaryRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
    
    // Card animation with some delay
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "back.out(1.7)" }
    );
    
    // Buttons animation with more delay
    gsap.fromTo(buttonsRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: "power3.out" }
    );
  }, []);

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Animate the transition to results page
    gsap.to([summaryRef.current, cardRef.current, buttonsRef.current], {
      opacity: 0,
      y: -30,
      stagger: 0.1,
      duration: 0.4,
      onComplete: () => navigate('/results')
    });
  };

  // Format preferences for display
  const formatPreference = (key: string, value: any) => {
    if (key === 'budgetMin' || key === 'budgetMax') {
      return `$${value}`;
    }
    if (Array.isArray(value)) {
      return value.join(', ') || 'None selected';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value || 'Not specified';
  };

  const sections = [
    {
      title: 'Basic Information',
      items: [
        { label: 'Looking to', value: data.propertyType },
        { label: 'Budget Range', value: `$${data.budgetMin} - $${data.budgetMax}` },
        { label: 'Bedrooms', value: data.bedrooms },
        { label: 'Bathrooms', value: data.bathrooms }
      ]
    },
    {
      title: 'Location & Move-in',
      items: [
        { label: 'Neighborhoods', value: data.neighborhoods.join(', ') || 'None selected' },
        { label: 'Move-in Date', value: data.moveInDate ? new Date(data.moveInDate).toLocaleDateString() : 'Not specified' },
        { label: 'Pets Allowed', value: data.petsAllowed ? 'Yes' : 'No' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Must-Have Amenities', value: data.amenities.join(', ') || 'None selected' },
        { label: 'Floor Preference', value: data.floorPreference || 'Not specified' },
        { label: 'Public Transportation', value: data.publicTransport || 'Not specified' },
        { label: 'View Preference', value: data.viewPreference || 'Not specified' }
      ]
    }
  ];

  return (
    <div className="form-step">
      <div ref={summaryRef} className="mb-8">
        <h2 className="text-2xl font-bold text-groww-dark mb-2">Summary</h2>
        <p className="text-gray-600">Review your preferences before we find your perfect apartment match.</p>
      </div>

      <div ref={cardRef} className="space-y-8">
        {sections.map((section, i) => (
          <div key={i} className="bg-accent rounded-lg p-5">
            <h3 className="text-lg font-semibold text-groww-dark mb-3">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Card className="p-4 bg-groww-soft-purple border-groww-purple border">
          <div className="flex items-center space-x-3">
            <div className="bg-groww-purple rounded-full p-2">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-groww-dark">Ready to find your perfect match!</h4>
              <p className="text-sm text-gray-600">Click 'Find Apartments' below to see your personalized recommendations.</p>
            </div>
          </div>
        </Card>
      </div>

      <div ref={buttonsRef} className="pt-6 flex justify-between">
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
          Find Apartments
        </Button>
      </div>
    </div>
  );
};

export default Summary;
