'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_CITIES } from '@/lib/queries';

interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface CitySearchProps {
  onSelectCity: (city: City) => void;
}

interface SearchCitiesData {
  searchCities: City[];
}

export function CitySearch({ onSelectCity }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search term (wait 300ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query cities only if search term is 2+ characters
  const { data, loading, error } = useQuery<SearchCitiesData>(SEARCH_CITIES, {
    variables: { query: debouncedTerm },
    skip: debouncedTerm.length < 2,
  });

  const cities: City[] = useMemo(() => data?.searchCities || [], [data]);

  // Show dropdown when we have results
  useEffect(() => {
    setShowDropdown(cities.length > 0 && searchTerm.length >= 2);
  }, [cities, searchTerm]);

  const handleSelectCity = (city: City) => {
    setSearchTerm(`${city.name}, ${city.country}`);
    setShowDropdown(false);
    onSelectCity(city);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a city..."
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="absolute mt-2 w-full p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">
          Error searching cities
        </div>
      )}

      {showDropdown && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {cities.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {city.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {city.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
