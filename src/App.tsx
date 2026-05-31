import { useState } from 'react';
import { Newspaper, AlertCircle } from 'lucide-react';
import './App.css';

import { Header } from './components/Header';
import { Selector } from './components/Selector';
import { GalleryView } from './components/GalleryView';
import { ReaderView } from './components/ReaderView';
import { fetchEdition } from './services/epaperService';
import type { PageInfo } from './services/epaperService';
import { cities } from './config/cities';

function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0].slug);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [readerPage, setReaderPage] = useState<number | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setPages([]);

    const result = await fetchEdition(selectedCity, selectedDate);
    
    if (result.error) {
      setError(result.error);
    } else {
      setPages(result.pages);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <Header />
      <Selector 
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <main className="main-content">
        {isLoading && (
          <div className="status-container">
            <div className="spinner status-icon" style={{ color: 'var(--accent-color)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
              </svg>
            </div>
            <h2 className="status-title">Discovering Edition...</h2>
            <p>Fetching and extracting pages from the Hindustan Times ePaper.</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="status-container">
            <AlertCircle size={48} className="status-icon" style={{ color: '#ef4444' }} />
            <h2 className="status-title">Edition Not Available</h2>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && pages.length === 0 && (
          <div className="status-container">
            <Newspaper size={48} className="status-icon" />
            <h2 className="status-title">Welcome to HT ePaper ScraperLOL</h2>
            <p>Select a city and date to load an edition.</p>
          </div>
        )}

        {!isLoading && !error && pages.length > 0 && (
          <GalleryView pages={pages} onOpenReader={setReaderPage} />
        )}

        {readerPage !== null && (
          <ReaderView 
            pages={pages} 
            initialPageNumber={readerPage} 
            onClose={() => setReaderPage(null)} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
