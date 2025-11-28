import React from 'react';
import { MapPin, BarChart3, Calendar } from 'lucide-react';

const LandingPage = ({ onRegionSelect }) => {
  const regions = ['All Regions', 'Nairobi', 'Central', 'Rift Valley', 'Western', 'Eastern', 'Coast', 'North Eastern', 'Nyanza'];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-4 leading-tight">Monitor Kenya's Forest Heritage</h2>
            <p className="text-xl text-green-200 mb-6">
              Track deforestation patterns using advanced satellite imagery and AI analysis
            </p>
            <p className="text-green-300 max-w-2xl mx-auto">
              Our platform provides real-time monitoring of Kenya's precious forests. Select a region below to view detailed satellite comparisons and receive AI-powered insights on forest health and degradation levels.
            </p>
          </div>

          {/* Region Filter */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-green-300">Select a Region to Begin</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => onRegionSelect(region)}
                  className="px-8 py-4 rounded-xl font-semibold transition bg-green-950 bg-opacity-60 text-white hover:bg-green-600 border-2 border-green-700 hover:border-green-500 hover:scale-105 backdrop-blur-sm"
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-6">
              <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">18 Forests</h4>
              <p className="text-sm text-green-200">Comprehensive coverage of major Kenyan forests across all regions</p>
            </div>
            <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-6">
              <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">AI Analysis</h4>
              <p className="text-sm text-green-200">Advanced algorithms detect degradation and provide actionable insights</p>
            </div>
            <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-6">
              <Calendar className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">Time Comparison</h4>
              <p className="text-sm text-green-200">Compare satellite imagery across different time periods</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
