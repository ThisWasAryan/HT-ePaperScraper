import React, { useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import type { PageInfo } from '../services/epaperService';

interface PageCardProps {
  page: PageInfo;
  index: number;
  onOpenReader: (index: number) => void;
}

export const PageCard: React.FC<PageCardProps> = ({ page, index, onOpenReader }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      const response = await fetch(page.fullResUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      const extension = page.fullResUrl.includes('.webp') ? 'webp' : 'jpg';
      const safeTitle = page.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      a.download = `HT_Archive_Page_${String(page.pageNumber).padStart(2, '0')}_${safeTitle}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error('Download failed', error);
      // Fallback
      window.open(page.fullResUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="page-card">
      <div className="card-image-container" onClick={() => onOpenReader(index)}>
        {!imageLoaded && <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute' }} />}
        <img
          src={page.thumbnailUrl || page.fullResUrl}
          alt={`Page ${page.pageNumber}`}
          className="card-image"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </div>
      <div className="card-footer">
        <div className="card-info">
          <div className="card-header-row">
            <span className="card-page-num serif">Page {page.pageNumber}</span>
            {page.section && (
              <span className={`card-section-badge ${page.section === 'Jacket Cover' ? 'badge-jacket' : page.section === 'Supplement' ? 'badge-supp' : ''}`}>
                {page.section}
              </span>
            )}
          </div>
          <span className="card-title">
            {page.title}
            {page.printPageNumber && page.printPageNumber !== `Page ${page.pageNumber}` && (
              <span className="card-print-badge"> ({page.printPageNumber})</span>
            )}
          </span>
        </div>
        <div className="card-actions">
          <button 
            className="btn-icon" 
            onClick={() => onOpenReader(index)}
            title="Open in Reader"
          >
            <Maximize2 size={20} />
          </button>
          <button 
            className="btn-icon" 
            onClick={handleDownload}
            title="Download Full Resolution"
            disabled={isDownloading}
            style={{ opacity: isDownloading ? 0.5 : 1 }}
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
