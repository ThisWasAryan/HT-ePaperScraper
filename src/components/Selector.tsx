import React, { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Edit2, Loader2 } from 'lucide-react';
import { cities, type CityConfig } from '../config/cities';
import { checkAvailableEditionsInRegion } from '../services/epaperService';

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCheckingEditions, setIsCheckingEditions] = useState(false);
  const [availableEditions, setAvailableEditions] = useState<CityConfig[]>([]);

  // Group cities by region
  const groupedCities = useMemo(() => {
    const groups = new Map<string, CityConfig[]>();
    
    cities.forEach(city => {
      const region = city.region || city.displayName;
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
    return regions[0] || 'Delhi';
  }, [selectedCity, groupedCities, regions]);

  // Proactively check all editions in the current region for the selected date
  useEffect(() => {
    let isCancelled = false;
    const allEditionsInRegion = groupedCities.get(currentRegion) || [];
    
    if (allEditionsInRegion.length === 0) {
      setAvailableEditions([]);
      return;
    }

    setIsCheckingEditions(true);

    checkAvailableEditionsInRegion(allEditionsInRegion, selectedDate)
      .then((validEditions) => {
        if (isCancelled) return;
        if (validEditions.length > 0) {
          setAvailableEditions(validEditions);
          // Auto-select first available edition if current selection is invalid or unavailable
          if (!validEditions.some(e => e.slug === selectedCity)) {
            onCityChange(validEditions[0].slug);
          }
        } else {
          // If no specific editions could be verified (e.g. network/unverified date), keep region editions as fallback
          setAvailableEditions(allEditionsInRegion);
        }
        setIsCheckingEditions(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error verifying editions:', err);
        // Fallback: keep region editions if verification network call fails
        setAvailableEditions(allEditionsInRegion);
        setIsCheckingEditions(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [currentRegion, selectedDate, groupedCities]);

  const handleRegionChange = (newRegion: string) => {
    const list = groupedCities.get(newRegion);
    if (list && list.length > 0) {
      setAvailableEditions(list);
      onCityChange(list[0].slug); // Set temporary city, effect will verify availability
    }
  };

  const handleSearch = () => {
    if (window.innerWidth <= 768) {
      setIsExpanded(false);
    }
    onSearch();
  };

  const allRegionEditions = groupedCities.get(currentRegion) || [];
  const displayList = availableEditions.length > 0 ? availableEditions : allRegionEditions;
  const selectedCityName = displayList.find(c => c.slug === selectedCity)?.displayName || 'Edition';

  if (!isExpanded) {
    return (
      <div className="selector-bar compact-selector">
        <div className="compact-info">
          <span className="compact-title serif">{selectedCityName}</span>
          <span className="compact-date">{format(selectedDate, 'MMMM d, yyyy')}</span>
        </div>
        <button className="btn-icon" onClick={() => setIsExpanded(true)} title="Edit Selection">
          <Edit2 size={20} />
        </button>
      </div>
    );
  }

  const isSearchDisabled = isLoading;

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
        <div className="label-with-status">
          <label htmlFor="edition-select">Select Edition</label>
          {isCheckingEditions && (
            <span className="edition-status-badge">
              <Loader2 size={12} className="spin-icon" /> Checking...
            </span>
          )}
        </div>
        <select
          id="edition-select"
          className="input-field"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={isLoading}
        >
          {displayList.map((city) => (
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
        onClick={handleSearch} 
        disabled={isSearchDisabled}
      >
        <Search size={20} />
        <span>
          {isLoading ? 'Loading...' : 'Load Edition'}
        </span>
      </button>
    </div>
  );
};
