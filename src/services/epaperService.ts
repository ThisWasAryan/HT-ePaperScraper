import { format } from 'date-fns';
import { getCityBySlug } from '../config/cities';

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

export const fetchEdition = async (citySlug: string, date: Date): Promise<EditionResult> => {
  const city = getCityBySlug(citySlug);
  if (!city) {
    return { pages: [], error: 'Invalid city selected.' };
  }

  // Format date as DD/MM/YYYY for the API
  const dateStr = format(date, 'dd/MM/yyyy');
  const editionUrl = `https://epaper.hindustantimes.com/Home/GetAllpages?editionid=${city.editionId}&editiondate=${dateStr}`;

  try {
    const response = await fetch(editionUrl);
    
    if (!response.ok) {
      return { pages: [], error: 'Failed to load edition. It might not be available for the selected date.' };
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return { pages: [], error: 'No pages found for the selected edition.' };
    }

    const pages: PageInfo[] = data.map((page: any) => {
      // The API provides TnImageUrl (thumbnail) and MrImageUrl (mid-res).
      // Based on original logic, replacing '_tn.jpg' with '.jpg' gets the un-suffixed high-res image.
      let fullResUrl = page.MrImageUrl || '';
      if (page.TnImageUrl) {
        fullResUrl = page.TnImageUrl.replace('_tn.jpg', '.jpg');
      }

      return {
        pageNumber: parseInt(page.PageNo || "0", 10),
        pageId: page.PageId?.toString() || `page-${page.PageNo}`,
        title: page.NewsProPageTitle || page.PageNumber || `Page ${page.PageNo}`,
        thumbnailUrl: page.TnImageUrl,
        fullResUrl: fullResUrl
      };
    });

    // Sort by page number to ensure correct reading order
    pages.sort((a, b) => a.pageNumber - b.pageNumber);

    return { pages };
  } catch (err) {
    return { pages: [], error: 'A network error occurred while fetching the edition.' };
  }
};
