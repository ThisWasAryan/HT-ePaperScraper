import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { cities, type CityConfig } from '../config/cities';

interface SelectorProps {
  selectedCity: string;
  onCityChange: (citySlug: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const Selector: React.FC<SelectorProps> = ({
  selectedCity,
  onCityChange,
  selectedDate,
  onDateChange,
  onSearch,
  isLoading
}) => {
  // Group cities by base region
  const groupedCities = useMemo(() => {
    const groups = new Map<string, CityConfig[]>();
    
    cities.forEach(city => {
      let region = city.displayName;
      const lower = city.displayName.toLowerCase();
      
      if (lower.includes('delhi')) region = 'Delhi';
      else if (lower.includes('mumbai')) region = 'Mumbai';
      else if (lower.includes('chandigarh')) region = 'Chandigarh';
      else if (lower.includes('ludhiana')) region = 'Ludhiana';
      else if (lower.includes('pune')) region = 'Pune';
      else if (lower.includes('patna')) region = 'Patna';
      else if (lower.includes('ranchi')) region = 'Ranchi';
      else if (lower.includes('lucknow')) region = 'Lucknow';
      else if (lower.includes('amritsar')) region = 'Amritsar';
      else if (lower.includes('gurgaon') || lower.includes('gurugram')) region = 'Gurugram';
      else if (lower.includes('up')) region = 'Uttar Pradesh';
      else if (lower.includes('punjab')) region = 'Punjab';
      else if (lower.includes('haryana')) region = 'Haryana';
      else if (lower.includes('rajasthan')) region = 'Rajasthan';
      
      if (!groups.has(region)) {
        groups.set(region, []);
      }
      groups.get(region)!.push(city);
    });
    
    return groups;
  }, []);

  const regions = Array.from(groupedCities.keys()).sort();

  // Determine current region based on selectedCity slug
  const currentRegion = useMemo(() => {
    for (const [region, cityList] of groupedCities.entries()) {
      if (cityList.some(c => c.slug === selectedCity)) {
        return region;
      }
    }
    return regions[0];
  }, [selectedCity, groupedCities, regions]);

  const handleRegionChange = (newRegion: string) => {
    const list = groupedCities.get(newRegion);
    if (list && list.length > 0) {
      onCityChange(list[0].slug); // Auto-select the first edition in the new region
    }
  };

  const currentEditions = groupedCities.get(currentRegion) || [];

  return (
    <div className="selector-bar">
      <div className="input-group">
        <label htmlFor="region-select">Select Region/City</label>
        <select
          id="region-select"
          className="input-field"
          value={currentRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          disabled={isLoading}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="edition-select">Select Edition</label>
        <select
          id="edition-select"
          className="input-field"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={isLoading}
        >
          {currentEditions.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="date-select">Publication Date</label>
        <input
          type="date"
          id="date-select"
          className="input-field"
          value={format(selectedDate, 'yyyy-MM-dd')}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => {
            if (e.target.value) {
              onDateChange(new Date(e.target.value));
            }
          }}
          disabled={isLoading}
        />
      </div>

      <button 
        className="btn-primary" 
        onClick={onSearch} 
        disabled={isLoading}
      >
        <Search size={20} />
        <span>{isLoading ? 'Loading...' : 'Load Edition'}</span>
      </button>
    </div>
  );
};
