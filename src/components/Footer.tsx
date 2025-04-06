
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="font-bold text-2xl text-groww-purple mb-4">
              AptMatch<span className="text-groww-dark">Buddy</span>
            </div>
            <p className="text-gray-600">
              Finding your perfect apartment match made easy.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg text-groww-dark mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-groww-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/questionnaire" className="text-gray-600 hover:text-groww-purple transition-colors">
                  Find Your Match
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-groww-purple transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg text-groww-dark mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-groww-purple transition-colors">
                  Renting Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-groww-purple transition-colors">
                  Apartment Checklist
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-groww-purple transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-lg text-groww-dark mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                help@aptmatchbuddy.com
              </li>
              <li className="text-gray-600">
                (123) 456-7890
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} AptMatchBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
