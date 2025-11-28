import React from 'react';
import { Home, BarChart3, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const AnalysisPage = ({
  selectedForest,
  selectedRegion,
  onBackToHome,
  onBackToResults,
  beforeDate,
  afterDate,
  setBeforeDate,
  setAfterDate,
  loadingImages,
  beforeImageUrl,
  afterImageUrl,
  analyzing,
  handleAnalyze,
  showAnalysis,
  analysisResult,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-4 min-h-[calc(100vh-160px)]">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-green-300">
        <button onClick={onBackToHome} className="hover:text-white flex items-center gap-1">
          <Home className="w-4 h-4" />
          Home
        </button>
        <span>/</span>
        <button onClick={onBackToResults} className="hover:text-white">
          {selectedRegion}
        </button>
        <span>/</span>
        <span className="text-white font-semibold">{selectedForest.name}</span>
      </div>

      {/* Forest Analysis Dashboard */}
      <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-1">{selectedForest.name}</h2>
            <p className="text-green-300">{selectedForest.location} • {selectedForest.area}</p>
          </div>
          <BarChart3 className="w-12 h-12 text-green-400" />
        </div>

        {/* Date Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">Before Date</label>
            <input
              type="month"
              value={beforeDate}
              onChange={(e) => setBeforeDate(e.target.value)}
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-green-300">After Date</label>
            <input
              type="month"
              value={afterDate}
              onChange={(e) => setAfterDate(e.target.value)}
              className="w-full bg-green-900 bg-opacity-40 border border-green-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
            />
          </div>
        </div>

        {/* Image Comparison */}
        {beforeDate && afterDate && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Satellite Image Comparison</h3>
            {loadingImages && (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-green-300">Loading NASA satellite imagery...</p>
              </div>
            )}
            {!loadingImages && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="bg-green-900 bg-opacity-30 border-2 border-green-600 rounded-lg h-48 md:h-64 flex items-center justify-center overflow-hidden">
                    {beforeImageUrl ? (
                      <img
                        src={beforeImageUrl}
                        alt="Before satellite image"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Calendar className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-green-300">Before: {beforeDate}</p>
                        <p className="text-xs text-green-400 mt-2">Select dates to load imagery</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3 bg-blue-600 bg-opacity-90 px-3 py-1 rounded text-sm font-semibold">
                    BEFORE
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-green-900 bg-opacity-30 border-2 border-red-600 rounded-lg h-48 md:h-64 flex items-center justify-center overflow-hidden">
                    {afterImageUrl ? (
                      <img
                        src={afterImageUrl}
                        alt="After satellite image"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Calendar className="w-12 h-12 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-green-300">After: {afterDate}</p>
                        <p className="text-xs text-green-400 mt-2">Select dates to load imagery</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3 bg-red-600 bg-opacity-90 px-3 py-1 rounded text-sm font-semibold">
                    AFTER
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyze Button */}
        {beforeDate && afterDate && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-3"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing with AI...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                Analyze Forest Degradation
              </>
            )}
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {showAnalysis && analysisResult && (
        <div className="bg-green-950 bg-opacity-60 backdrop-blur-md border border-green-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-green-400" />
            AI Analysis Results
          </h3>

          {/* Degradation Level */}
          <div className={`${analysisResult.lossPct > 20 ? 'bg-red-900 border-red-600' :
            analysisResult.lossPct > 10 ? 'bg-yellow-900 border-yellow-600' :
              'bg-green-900 border-green-600'
            } bg-opacity-30 border rounded-lg p-6 mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className={`w-8 h-8 ${analysisResult.lossPct > 20 ? 'text-red-400' :
                analysisResult.lossPct > 10 ? 'text-yellow-400' :
                  'text-green-400'
                }`} />
              <div>
                <h4 className="text-xl font-bold">
                  Degradation Level: {
                    analysisResult.lossPct > 20 ? 'HIGH' :
                      analysisResult.lossPct > 10 ? 'MEDIUM' :
                        'LOW'
                  }
                </h4>
                <p className={`${analysisResult.lossPct > 20 ? 'text-red-300' :
                  analysisResult.lossPct > 10 ? 'text-yellow-300' :
                    'text-green-300'
                  }`}>
                  Estimated {analysisResult.lossPct.toFixed(2)}% forest cover loss detected
                </p>
              </div>
            </div>
            <div className="w-full bg-green-950 bg-opacity-60 rounded-full h-4 mt-4">
              <div className={`h-4 rounded-full ${analysisResult.lossPct > 20 ? 'bg-red-500' :
                analysisResult.lossPct > 10 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} style={{ width: `${Math.min(100, analysisResult.lossPct)}%` }}></div>
            </div>
          </div>

          {/* Change Detection Map */}
          {analysisResult.changeMap && (
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-green-300">Change Detection Map:</h4>
              <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg">
                <img
                  src={`data:image/png;base64,${analysisResult.changeMap}`}
                  alt="Change detection map"
                  className="w-full rounded-lg"
                />
                <p className="text-sm text-green-300 mt-2">Darker areas indicate vegetation loss</p>
              </div>
            </div>
          )}

          {/* Before/After Images */}
          {(analysisResult.before || analysisResult.after) && (
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-green-300">Satellite Imagery Comparison:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {analysisResult.before && (
                  <div>
                    <p className="text-sm text-green-300 mb-2">Before: {beforeDate}</p>
                    <img
                      src={`data:image/jpeg;base64,${analysisResult.before}`}
                      alt="Before"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
                {analysisResult.after && (
                  <div>
                    <p className="text-sm text-green-300 mb-2">After: {afterDate}</p>
                    <img
                      src={`data:image/jpeg;base64,${analysisResult.after}`}
                      alt="After"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-green-300">Recommendations:</h4>
            <div className="space-y-3">
              {analysisResult.lossPct > 15 && (
                <div className="flex items-start gap-3 bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-700">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Immediate Intervention Required</p>
                    <p className="text-sm text-green-200">Deploy forest rangers to identified hotspot areas to prevent further illegal logging</p>
                  </div>
                </div>
              )}
              {analysisResult.lossPct > 5 && (
                <div className="flex items-start gap-3 bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-700">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Reforestation Program</p>
                    <p className="text-sm text-green-200">Initiate tree planting initiatives focusing on indigenous species to restore degraded areas</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-700">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Community Engagement</p>
                  <p className="text-sm text-green-200">Establish community forest management programs and alternative livelihood initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
