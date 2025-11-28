import React, { useState, useEffect } from 'react';
import { fetchGibs, runCompare, fetchForests } from './api/api';
import { useNotification } from './components/NotificationProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/AnalysisPage';
import ContactModal from './components/ContactModal';

function App() {
  const { showError } = useNotification();
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'results', 'analysis'
  const [selectedForest, setSelectedForest] = useState(null);
  const [beforeDate, setBeforeDate] = useState('');
  const [afterDate, setAfterDate] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [forests, setForests] = useState([]);
  const [loadingForests, setLoadingForests] = useState(true);

  // New states for real API integration
  const [beforeImageUrl, setBeforeImageUrl] = useState(null);
  const [afterImageUrl, setAfterImageUrl] = useState(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);


  const filteredForests = selectedRegion === 'All Regions'
    ? forests
    : forests.filter(forest => forest.region === selectedRegion);

  // Fetch forests data on mount
  useEffect(() => {
    const loadForests = async () => {
      try {
        const response = await fetchForests();
        setForests(response.data.forests);
      } catch (error) {
        console.error('Failed to load forests:', error);
        showError('Failed to load forest data. Please refresh the page.');
      } finally {
        setLoadingForests(false);
      }
    };

    loadForests();
  }, []);

  // Simulate visitor tracking
  useEffect(() => {
    const count = Math.floor(Math.random() * 5000) + 1500;
    setVisitorCount(count);
  }, []);

  // Load satellite images when dates change
  useEffect(() => {
    if (beforeDate && afterDate && selectedForest) {
      loadSatelliteImages();
    }
  }, [beforeDate, afterDate, selectedForest]);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setCurrentPage('results');
  };

  const loadSatelliteImages = async () => {
    if (!beforeDate || !afterDate || !selectedForest) return;

    setLoadingImages(true);
    setBeforeImageUrl(null);
    setAfterImageUrl(null);

    try {
      // Convert YYYY-MM to YYYY-MM-01 (first day of month)
      const beforeFullDate = `${beforeDate}-01`;
      const afterFullDate = `${afterDate}-01`;
      
      const beforeResp = await fetchGibs(selectedForest.name, beforeFullDate);
      const afterResp = await fetchGibs(selectedForest.name, afterFullDate);

      // Detect content type from response
      const beforeContentType = beforeResp.headers['content-type'] || 'image/jpeg';
      const afterContentType = afterResp.headers['content-type'] || 'image/jpeg';

      const beforeBlob = new Blob([beforeResp.data], { type: beforeContentType });
      const afterBlob = new Blob([afterResp.data], { type: afterContentType });

      setBeforeImageUrl(URL.createObjectURL(beforeBlob));
      setAfterImageUrl(URL.createObjectURL(afterBlob));
    } catch (error) {
      console.error('Failed to load satellite images:', error);
      showError('Failed to load satellite images. Please try different dates.');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleAnalyze = async () => {
    if (!beforeDate || !afterDate || !selectedForest) {
      showError('Please select both dates first');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Convert YYYY-MM to YYYY-MM-01 (first day of month)
      const beforeFullDate = `${beforeDate}-01`;
      const afterFullDate = `${afterDate}-01`;
      
      const result = await runCompare({
        forest: selectedForest.name,
        beforeDate: beforeFullDate,
        afterDate: afterFullDate
      });

      setAnalysisResult(result.data);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      showError('Failed to analyze forest. Please check your dates and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleForestSelect = (forest) => {
    setSelectedForest(forest);
    setCurrentPage('analysis');
    setShowAnalysis(false);
    setBeforeDate('');
    setAfterDate('');
    setBeforeImageUrl(null);
    setAfterImageUrl(null);
    setAnalysisResult(null);
  };

  const handleBackToResults = () => {
    setSelectedForest(null);
    setCurrentPage('results');
    setShowAnalysis(false);
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
    setSelectedForest(null);
    setSelectedRegion('');
    setShowAnalysis(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'results':
        return (
          <ResultsPage
            selectedRegion={selectedRegion}
            filteredForests={filteredForests}
            onBackToHome={handleBackToHome}
            onRegionSelect={handleRegionSelect}
            onForestSelect={handleForestSelect}
          />
        );
      case 'analysis':
        return (
          <AnalysisPage
            selectedForest={selectedForest}
            selectedRegion={selectedRegion}
            onBackToHome={handleBackToHome}
            onBackToResults={handleBackToResults}
            beforeDate={beforeDate}
            afterDate={afterDate}
            setBeforeDate={setBeforeDate}
            setAfterDate={setAfterDate}
            loadingImages={loadingImages}
            beforeImageUrl={beforeImageUrl}
            afterImageUrl={afterImageUrl}
            analyzing={analyzing}
            handleAnalyze={handleAnalyze}
            showAnalysis={showAnalysis}
            analysisResult={analysisResult}
          />
        );
      case 'landing':
      default:
        return <LandingPage onRegionSelect={handleRegionSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 text-white relative overflow-x-hidden overflow-y-auto flex flex-col">
      {/* Forest Background Overlay */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M50 10 L55 30 L75 30 L58 42 L65 62 L50 50 L35 62 L42 42 L25 30 L45 30 Z\" fill=\"%23fff\"/%3E%3C/svg%3E')" }}></div>

      <Header visitorCount={visitorCount} onLogoClick={handleBackToHome} />

      <div className="relative z-10 flex-grow">
        {renderPage()}
      </div>

      <Footer onContactClick={() => setShowContact(true)} />

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  );
}

export default App;
