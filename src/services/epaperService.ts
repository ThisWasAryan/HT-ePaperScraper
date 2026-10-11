import { format } from 'date-fns';
import { getCityBySlug, type CityConfig } from '../config/cities';

export interface PageInfo {
  pageNumber: number;
  pageId: string;
  title: string;
  thumbnailUrl: string;
  fullResUrl: string;
}

export interface EditionResult {
  pages: PageInfo[];
  error?: string;
}

export interface EditionAvailability {
  slug: string;
  displayName: string;
  hasPages: boolean;
  pageCount: number;
}

// In-memory cache storing edition results by `${citySlug}_${dateStr}`
const editionCache = new Map<string, EditionResult>();

export const fetchEdition = async (citySlug: string, date: Date): Promise<EditionResult> => {
  const city = getCityBySlug(citySlug);
  if (!city) {
    return { pages: [], error: 'Invalid city selected.' };
  }

  const dateStr = format(date, 'yyyy-MM-dd');
  const cacheKey = `${city.slug}_${dateStr}`;

  if (editionCache.has(cacheKey)) {
    return editionCache.get(cacheKey)!;
  }

  const query = `editioncode=${encodeURIComponent(city.editionCode)}&editiondate=${dateStr}`;

  // Priority 1: relative URL (routed through Vite dev proxy or same-origin)
  // Priority 2: direct full URL
  const endpoints = [
    `/api/get-all-pages?${query}`,
    `https://epaper.hindustantimes.com/api/get-all-pages?${query}`
  ];

  let lastError = 'Failed to load edition. It might not be available for the selected date.';

  for (const url of endpoints) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          lastError = 'This edition is not available for the selected date.';
        } else {
          lastError = `Server responded with status ${response.status}.`;
        }
        continue;
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        const emptyResult = { pages: [], error: 'No pages found for the selected edition.' };
        editionCache.set(cacheKey, emptyResult);
        return emptyResult;
      }

      const pages: PageInfo[] = data.map((page: any, index: number) => {
        // High-res image: the API provides HrImageUrl and HighResolution directly in WebP
        let fullResUrl = page.HrImageUrl || page.HighResolution || page.MrImageUrl || '';
        if (!fullResUrl && page.TnImageUrl) {
          fullResUrl = page.TnImageUrl
            .replace('_tn.webp', '_hr.webp')
            .replace('_tn.jpg', '.jpg');
        }

        // Thumbnail image
        const thumbnailUrl = page.TnImageUrl || page.MrImageUrl || fullResUrl;

        const pageNum = parseInt(page.PageNo || page.Sequence || String(index + 1), 10) || (index + 1);

        return {
          pageNumber: pageNum,
          pageId: page.PageId?.toString() || page.PageOrgId || `page-${pageNum}`,
          title: page.NewsProPageTitle || page.PageNumber || `Page ${pageNum}`,
          thumbnailUrl,
          fullResUrl
        };
      });

      // Sort by page number to ensure correct reading order
      pages.sort((a, b) => a.pageNumber - b.pageNumber);

      const successResult = { pages };
      editionCache.set(cacheKey, successResult);
      return successResult;
    } catch {
      lastError = 'Network error fetching the edition. Please ensure you are running the local server.';
    }
  }

  const failedResult = { pages: [], error: lastError };
  return failedResult;
};

/**
 * Checks whether an edition has actual pages on a given date.
 */
export const checkEditionAvailability = async (
  citySlug: string,
  date: Date
): Promise<EditionAvailability> => {
  const city = getCityBySlug(citySlug);
  if (!city) {
    return { slug: citySlug, displayName: citySlug, hasPages: false, pageCount: 0 };
  }

  const result = await fetchEdition(citySlug, date);
  return {
    slug: city.slug,
    displayName: city.displayName,
    hasPages: !result.error && result.pages.length > 0,
    pageCount: result.pages.length
  };
};

/**
 * Concurrently checks all editions in a region and filters to only those that have pages.
 */
export const checkAvailableEditionsInRegion = async (
  editions: CityConfig[],
  date: Date
): Promise<CityConfig[]> => {
  const checks = editions.map(async (city) => {
    const status = await checkEditionAvailability(city.slug, date);
    return { city, hasPages: status.hasPages };
  });

  const results = await Promise.all(checks);
  return results.filter((r) => r.hasPages).map((r) => r.city);
};
