
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-groww-soft-purple to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-groww-dark">
              Find Your Perfect Apartment Match
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
              Answer a few questions and let our smart matching system find apartments that perfectly match your preferences, needs, and budget.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/questionnaire"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-groww-purple hover:bg-groww-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-groww-purple shadow-md"
              >
                Start Matching
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-groww-dark bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-groww-light-purple"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-end">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-groww-light-purple/50 absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-groww-purple/30 absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"></div>
              <div className="relative w-full max-w-md apt-card p-4 bg-white rounded-xl shadow-lg border border-border">
                <div className="h-48 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Apartment Image</span>
                </div>
                <div className="py-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">Luxury Apartment</h3>
                    <span className="font-bold text-groww-purple">$1,850/mo</span>
                  </div>
                  <p className="text-gray-500 text-sm">Downtown • 2 bd • 2 ba • 950 sqft</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple-dark rounded-full text-xs">Pet Friendly</span>
                    <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple-dark rounded-full text-xs">Gym</span>
                    <span className="px-2 py-1 bg-groww-soft-purple text-groww-purple-dark rounded-full text-xs">Pool</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
