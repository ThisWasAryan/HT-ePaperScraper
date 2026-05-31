import React from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { cities } from '../config/cities';

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
  return (
    <div className="selector-bar">
      <div className="input-group">
        <label htmlFor="city-select">Select City</label>
        <select
          id="city-select"
          className="input-field"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={isLoading}
        >
          {cities.map((city) => (
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
