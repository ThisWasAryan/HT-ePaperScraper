import React, { useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import type { PageInfo } from '../services/epaperService';

interface PageCardProps {
  page: PageInfo;
  onOpenReader: (pageNumber: number) => void;
}

export const PageCard: React.FC<PageCardProps> = ({ page, onOpenReader }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use an anchor tag to trigger download directly
    const a = document.createElement('a');
    a.href = page.fullResUrl;
    a.download = `Page_${page.pageNumber}.jpg`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="page-card">
      <div className="card-image-container" onClick={() => onOpenReader(page.pageNumber)}>
        {!imageLoaded && <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute' }} />}
        <img
          src={page.fullResUrl}
          alt={`Page ${page.pageNumber}`}
          className="card-image"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </div>
      <div className="card-footer">
        <div className="card-info">
          <span className="card-page-num">Page {page.pageNumber}</span>
          <span className="card-title">{page.title}</span>
        </div>
        <div className="card-actions">
          <button 
            className="btn-icon" 
            onClick={() => onOpenReader(page.pageNumber)}
            title="Open in Reader"
          >
            <Maximize2 size={20} />
          </button>
          <button 
            className="btn-icon" 
            onClick={handleDownload}
            title="Download Full Resolution"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
