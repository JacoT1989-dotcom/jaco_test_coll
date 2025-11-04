'use client';

import { useQuery } from '@apollo/client/react';
import { GET_7_DAY_FORECAST } from '@/lib/queries';

interface ForecastDisplayProps {
  latitude: number;
  longitude: number;
}

interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
}

interface Get7DayForecastData {
  get7DayForecast: DailyForecast[];
}

export function ForecastDisplay({ latitude, longitude }: ForecastDisplayProps) {
  const { data, loading, error } = useQuery<Get7DayForecastData>(GET_7_DAY_FORECAST, {
    variables: { latitude, longitude },
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">7-Day Forecast</h3>
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="min-w-[120px] animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 rounded-lg shadow-lg p-6">
        <p className="text-red-700 dark:text-red-100">Error loading forecast data</p>
      </div>
    );
  }

  const forecast = data?.get7DayForecast;

  if (!forecast) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">7-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {formatDate(day.date)}
            </p>

            <div className="mb-2">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  day.condition === 'Sunny'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                }`}
              >
                {day.condition}
              </span>
            </div>

            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {day.temperatureMax.toFixed(0)}°
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {day.temperatureMin.toFixed(0)}°
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {day.precipitation.toFixed(1)} mm
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
