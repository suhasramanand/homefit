
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
          <Link to="/results" className="font-medium text-gray-700 hover:text-groww-purple transition-colors">
            Apartments
          </Link>
          <div className="relative group">
            <button className="font-medium text-gray-700 hover:text-groww-purple transition-colors flex items-center">
              Login
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link 
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-groww-soft-purple rounded-t-md"
              >
                User Login
              </Link>
              <Link 
                to="/login" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-groww-soft-purple"
              >
                Broker Login
              </Link>
              <Link 
                to="/login" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-groww-soft-purple rounded-b-md"
              >
                Admin Login
              </Link>
            </div>
          </div>
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
