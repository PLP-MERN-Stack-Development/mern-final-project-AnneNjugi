import React from 'react';
import { Home, Filter, MapPin } from 'lucide-react';

const ResultsPage = ({
  selectedRegion,
  filteredForests,
  onBackToHome,
  onRegionSelect,
  onForestSelect,
}) => {
  const regions = ['All Regions', 'Nairobi', 'Central', 'Rift Valley', 'Western', 'Eastern', 'Coast', 'North Eastern', 'Nyanza'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-4 min-h-[calc(100vh-160px)]">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-green-300">
        <button onClick={onBackToHome} className="hover:text-white flex items-center gap-1">
          <Home className="w-4 h-4" />
          Home
        </button>
        <span>/</span>
        <span className="text-white font-semibold">{selectedRegion}</span>
      </div>

      {/* Active Filter with Change Option */}
      <div className="mb-8 bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-sm text-green-300">Viewing forests in</p>
              <p className="text-2xl font-bold">{selectedRegion}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.filter(r => r !== selectedRegion).map(region => (
              <button
                key={region}
                onClick={() => onRegionSelect(region)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition bg-green-900 bg-opacity-40 text-green-300 hover:bg-green-600 hover:text-white border border-green-700"
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          {filteredForests.length} Forest{filteredForests.length !== 1 ? 's' : ''} Found
        </h2>
        <p className="text-green-300">Click on any forest to view detailed analysis</p>
      </div>

      {/* Forest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForests.map(forest => (
          <div
            key={forest.id}
            onClick={() => onForestSelect(forest)}
            className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-6 hover:bg-opacity-80 hover:border-green-500 transition cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <MapPin className="w-6 h-6 text-green-400 group-hover:text-green-300" />
              <span className="text-xs bg-green-600 bg-opacity-50 px-2 py-1 rounded">{forest.area}</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-green-300 transition">{forest.name}</h3>
            <p className="text-sm text-green-300">{forest.location}</p>
          </div>
        ))}
      </div>

      {filteredForests.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-green-300 mb-4">No forests found in this region</p>
          <button
            onClick={() => onRegionSelect('All Regions')}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
          >
            View All Forests
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
