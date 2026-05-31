import React from 'react';
import type { PageInfo } from '../services/epaperService';
import { PageCard } from './PageCard';

interface GalleryViewProps {
  pages: PageInfo[];
  onOpenReader: (pageNumber: number) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ pages, onOpenReader }) => {
  if (pages.length === 0) return null;

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2 className="gallery-title serif">Edition Pages</h2>
        <span style={{ color: 'var(--text-secondary)' }}>
          {pages.length} pages found
        </span>
      </div>
      <div className="gallery-grid">
        {pages.map((page) => (
          <PageCard 
            key={page.pageId} 
            page={page} 
            onOpenReader={onOpenReader} 
          />
        ))}
      </div>
    </div>
  );
};
