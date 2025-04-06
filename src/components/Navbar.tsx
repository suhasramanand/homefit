
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-border py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="font-bold text-2xl text-groww-purple">
            AptMatch<span className="text-groww-dark">Buddy</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium text-gray-700 hover:text-groww-purple transition-colors">
            Home
          </Link>
          <Link to="/questionnaire" className="font-medium text-gray-700 hover:text-groww-purple transition-colors">
            Find Your Match
          </Link>
          <Link to="/about" className="font-medium text-gray-700 hover:text-groww-purple transition-colors">
            How It Works
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/questionnaire" 
            className="inline-flex items-center justify-center px-4 py-2 bg-groww-purple text-white rounded-lg hover:bg-groww-purple-dark transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
