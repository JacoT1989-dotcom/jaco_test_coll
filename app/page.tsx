'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { CitySearch } from '@/components/city-search';
import { WeatherDisplay } from '@/components/weather-display';
import { ForecastDisplay, DailyForecast } from '@/components/forecast-display';
import { ActivitiesDisplay } from '@/components/activities-display';
import { GET_USER_LOCATION } from '@/lib/queries';

interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface LocationQueryData {
  getUserLocation: City;
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedForecast, setSelectedForecast] = useState<DailyForecast | null>(null);

  // Fetch user's location based on IP address
  const { data: locationData, loading: locationLoading } = useQuery<LocationQueryData>(GET_USER_LOCATION);

  // Set user's location as the default city on mount
  useEffect(() => {
    if (locationData?.getUserLocation && !selectedCity) {
      setSelectedCity(locationData.getUserLocation);
    }
  }, [locationData, selectedCity]);

  const handleSelectDay = (dayIndex: number, forecast: DailyForecast) => {
    setSelectedDay(dayIndex);
    setSelectedForecast(forecast);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* City Search - Always visible */}
        <div className="flex justify-center">
          <CitySearch onSelectCity={setSelectedCity} />
        </div>

        {/* Show loading state, content when city is selected, or empty state */}
        {locationLoading ? (
          /* Loading State */
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Detecting your location...
            </p>
          </div>
        ) : selectedCity ? (
          <>
            {/* City Name Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedCity.name}, {selectedCity.country}
              </h2>
            </div>

            {/* Current Weather */}
            <WeatherDisplay
              latitude={selectedCity.latitude}
              longitude={selectedCity.longitude}
              forecastData={selectedForecast}
            />

            {/* 7-Day Forecast */}
            <ForecastDisplay
              latitude={selectedCity.latitude}
              longitude={selectedCity.longitude}
              selectedDay={selectedDay}
              onSelectDay={handleSelectDay}
            />

            {/* Activity Rankings */}
            <ActivitiesDisplay
              latitude={selectedCity.latitude}
              longitude={selectedCity.longitude}
              forecastData={selectedForecast}
            />
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Search for a city to see weather and activity recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
