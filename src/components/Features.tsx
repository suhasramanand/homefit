
import React from 'react';

const features = [
  {
    title: 'Smart Matching',
    description: 'Our algorithm analyzes your preferences to find apartments that match your needs.',
    icon: '🔍'
  },
  {
    title: 'Save Time',
    description: 'Skip endless browsing and let us find the best matches for you in seconds.',
    icon: '⏱️'
  },
  {
    title: 'Personalized Results',
    description: 'Get apartment recommendations based on your unique preferences and priorities.',
    icon: '✨'
  },
  {
    title: 'Comprehensive Filters',
    description: 'Filter by budget, location, amenities, and more to refine your apartment search.',
    icon: '🏆'
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-groww-dark">How AptMatch Buddy Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We simplify your apartment search by matching you with properties that fit your exact needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-groww-soft-purple rounded-lg flex items-center justify-center text-2xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-groww-dark mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
