import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download, Maximize } from 'lucide-react';
import type { PageInfo } from '../services/epaperService';

interface ReaderViewProps {
  pages: PageInfo[];
  initialPageNumber: number;
  onClose: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ pages, initialPageNumber, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = pages.findIndex((p) => p.pageNumber === initialPageNumber);
    return index >= 0 ? index : 0;
  });
  
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentPage = pages[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsZoomed(false);
      setImageLoaded(false);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsZoomed(false);
      setImageLoaded(false);
    }
  }, [currentIndex, pages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onClose]);

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentPage.fullResUrl;
    a.download = `Page_${currentPage.pageNumber}.jpg`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (!currentPage) return null;

  return (
    <div className="reader-container">
      <div className="reader-header">
        <div className="reader-title-area">
          <button className="reader-close" onClick={onClose}>
            <X size={24} />
            <span>Close</span>
          </button>
          <div className="reader-page-info">
            <span className="reader-page-number">Page {currentPage.pageNumber} of {pages[pages.length - 1].pageNumber}</span>
            <span className="reader-page-title">{currentPage.title}</span>
          </div>
        </div>

        <div className="reader-controls">
          <button className="btn-icon" onClick={toggleZoom} title={isZoomed ? "Zoom Out" : "Zoom In"}>
            {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button className="btn-icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
            <Maximize size={20} />
          </button>
          <button className="btn-icon" onClick={handleDownload} title="Download Full Resolution">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="reader-content" onClick={() => isZoomed && toggleZoom()}>
        {!imageLoaded && (
          <div className="spinner" style={{ position: 'absolute', color: 'var(--accent-color)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        )}
        <img
          src={currentPage.fullResUrl}
          alt={`Page ${currentPage.pageNumber}`}
          className={`reader-image ${isZoomed ? 'zoomed' : ''}`}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onClick={(e) => {
            if (!isZoomed) {
              e.stopPropagation();
              toggleZoom();
            }
          }}
        />

        <button 
          className="reader-nav reader-prev" 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          disabled={currentIndex === 0}
          aria-label="Previous Page"
        >
          <ChevronLeft size={32} />
        </button>

        <button 
          className="reader-nav reader-next" 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          disabled={currentIndex === pages.length - 1}
          aria-label="Next Page"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Background Preloader for upcoming pages */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {pages.slice(currentIndex + 1, currentIndex + 4).map((p) => (
          <img key={`preload-${p.pageId}`} src={p.fullResUrl} alt="" />
        ))}
      </div>
    </div>
  );
};
