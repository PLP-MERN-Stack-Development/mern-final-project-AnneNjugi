import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, BarChart3, Calendar } from 'lucide-react';

const LandingPage = ({ onRegionSelect }) => {
  const { t } = useTranslation();

  const regions = [
    { key: 'all', value: 'All Regions' },
    { key: 'nairobi', value: 'Nairobi' },
    { key: 'central', value: 'Central' },
    { key: 'riftValley', value: 'Rift Valley' },
    { key: 'western', value: 'Western' },
    { key: 'eastern', value: 'Eastern' },
    { key: 'coast', value: 'Coast' },
    { key: 'northEastern', value: 'North Eastern' },
    { key: 'nyanza', value: 'Nyanza' }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-4xl text-center">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{t('landing.heroTitle')}</h2>
            <p className="text-lg sm:text-xl text-green-200 mb-6">
              {t('landing.heroSubtitle')}
            </p>
            <p className="text-green-300 max-w-2xl mx-auto text-sm sm:text-base">
              {t('landing.heroDescription')}
            </p>
          </div>

          {/* Region Filter */}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-green-300">{t('landing.selectRegion')}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {regions.map(region => (
                <button
                  key={region.key}
                  onClick={() => onRegionSelect(t(`landing.regions.${region.key}`))}
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold transition bg-green-950 bg-opacity-60 text-white hover:bg-green-600 border-2 border-green-700 hover:border-green-500 hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
                >
                  {t(`landing.regions.${region.key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
            <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-4 sm:p-6">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-bold text-base sm:text-lg mb-2">{t('landing.features.forests.title')}</h4>
              <p className="text-sm text-green-200">{t('landing.features.forests.description')}</p>
            </div>
            <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-4 sm:p-6">
              <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-bold text-base sm:text-lg mb-2">{t('landing.features.analysis.title')}</h4>
              <p className="text-sm text-green-200">{t('landing.features.analysis.description')}</p>
            </div>
            <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-4" />
              <h4 className="font-bold text-base sm:text-lg mb-2">{t('landing.features.comparison.title')}</h4>
              <p className="text-sm text-green-200">{t('landing.features.comparison.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
