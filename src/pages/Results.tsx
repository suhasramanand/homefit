
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResultsContainer from '@/components/results/ResultsContainer';

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <ResultsContainer />
      </main>
      <Footer />
    </div>
  );
};

export default Results;
