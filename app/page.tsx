'use client';

import { useState } from 'react';
import { CitySearch } from '@/components/city-search';
import { WeatherDisplay } from '@/components/weather-display';
import { ForecastDisplay, DailyForecast } from '@/components/forecast-display';
import { ActivitiesDisplay } from '@/components/activities-display';

interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedForecast, setSelectedForecast] = useState<DailyForecast | null>(null);

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

        {/* Show content only when city is selected */}
        {selectedCity ? (
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
