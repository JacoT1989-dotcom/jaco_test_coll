'use client';

import { useQuery } from '@apollo/client/react';
import { GET_7_DAY_FORECAST } from '@/lib/queries';

interface ForecastDisplayProps {
  latitude: number;
  longitude: number;
  selectedDay?: number;
  onSelectDay?: (dayIndex: number, forecast: DailyForecast) => void;
}

export interface DailyForecast {
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

export function ForecastDisplay({ latitude, longitude, selectedDay = 0, onSelectDay }: ForecastDisplayProps) {
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
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2">
        {forecast.map((day, index) => (
          <button
            key={index}
            onClick={() => onSelectDay?.(index, day)}
            className={`rounded-lg p-4 flex flex-col items-center transition-all hover:scale-105 cursor-pointer min-w-[150px] shrink-0 ${
              selectedDay === index
                ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">
              {formatDate(day.date)}
            </p>

            <div className="mb-3">
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

            <div className="mb-3 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {day.temperatureMax.toFixed(0)}°
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {day.temperatureMin.toFixed(0)}°
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                High / Low
              </p>
            </div>

            <div className="w-full space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Wind:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {day.windSpeed.toFixed(0)} km/h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Rain:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {day.precipitation.toFixed(1)} mm
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
