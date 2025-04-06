
import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: 1,
    title: 'Complete the Questionnaire',
    description: 'Answer questions about your budget, preferred location, must-have amenities, and other preferences.'
  },
  {
    number: 2,
    title: 'Get Matched',
    description: 'Our algorithm analyzes your answers and matches you with apartments that best fit your criteria.'
  },
  {
    number: 3,
    title: 'Explore Recommendations',
    description: 'Browse your personalized apartment recommendations, filter results, and save your favorites.'
  },
  {
    number: 4,
    title: 'Find Your Perfect Home',
    description: 'Contact property managers, schedule viewings, and find the perfect apartment that meets all your needs.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-groww-soft-purple/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-groww-dark">Simple 4-Step Process</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Finding your perfect apartment match has never been easier.
          </p>
        </div>
        
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute left-0 right-0 top-24 h-1 bg-groww-purple-dark/30" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-groww-purple text-white flex items-center justify-center font-bold text-xl z-10 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-groww-dark text-center mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/questionnaire"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-groww-purple hover:bg-groww-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-groww-purple shadow-md"
          >
            Start Your Match
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
