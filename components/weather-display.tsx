'use client';

import { useQuery } from '@apollo/client/react';
import { GET_WEATHER } from '@/lib/queries';
import { DailyForecast } from './forecast-display';

interface WeatherDisplayProps {
  latitude: number;
  longitude: number;
  forecastData?: DailyForecast | null;
}

interface Weather {
  temperature: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
}

interface GetWeatherData {
  getWeather: Weather;
}

export function WeatherDisplay({ latitude, longitude, forecastData }: WeatherDisplayProps) {
  const { data, loading, error } = useQuery<GetWeatherData>(GET_WEATHER, {
    variables: { latitude, longitude },
    skip: !!forecastData, // Skip if we have forecast data
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 rounded-lg shadow-lg p-6">
        <p className="text-red-700 dark:text-red-100">
          Error loading weather data
        </p>
      </div>
    );
  }

  // Use forecast data if available, otherwise use current weather
  const weather = forecastData ? {
    temperature: (forecastData.temperatureMax + forecastData.temperatureMin) / 2,
    condition: forecastData.condition,
    windSpeed: forecastData.windSpeed,
    precipitation: forecastData.precipitation,
  } : data?.getWeather;

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {forecastData && (
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {new Date(forecastData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
      )}
      
      <div className="mb-4">
        {forecastData ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {forecastData.temperatureMax.toFixed(1)}°C / {forecastData.temperatureMin.toFixed(1)}°C
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              High / Low
            </p>
          </div>
        ) : (
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {weather.temperature.toFixed(1)}°C
          </h2>
        )}
      </div>

      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            weather.condition === 'Sunny'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
          }`}
        >
          {weather.condition}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {weather.windSpeed.toFixed(1)} km/h
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Precipitation</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {weather.precipitation.toFixed(1)} mm
          </p>
        </div>
      </div>
    </div>
  );
}
