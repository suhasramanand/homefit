
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { QuestionnaireProvider } from '@/contexts/QuestionnaireContext';
import QuestionnaireContainer from '@/components/questionnaire/QuestionnaireContainer';

const Questionnaire = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-groww-dark">Find Your Perfect Apartment</h1>
            <p className="mt-2 text-lg text-gray-600">
              Answer a few questions to help us find the best apartment matches for you.
            </p>
          </div>
          <QuestionnaireProvider>
            <QuestionnaireContainer />
          </QuestionnaireProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Questionnaire;
