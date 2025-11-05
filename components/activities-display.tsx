'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ACTIVITIES } from '@/lib/queries';
import { DailyForecast } from './forecast-display';
import { useMemo } from 'react';

interface ActivitiesDisplayProps {
  latitude: number;
  longitude: number;
  forecastData?: DailyForecast | null;
}

interface Activity {
  name: string;
  score: number;
  reason: string;
}

interface GetActivitiesData {
  getActivities: Activity[];
}

interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
}

// Scoring functions
function scoreSkiing(weather: WeatherData): Activity {
  let score = 0;
  const reasons: string[] = [];

  if (weather.temperature < 0) {
    score += 50;
    reasons.push('ideal cold temperature');
  } else if (weather.temperature < 10) {
    score += 30;
    reasons.push('suitable cool temperature');
  } else {
    score += 10;
    reasons.push('too warm');
  }

  if (weather.precipitation > 0) {
    score += 30;
    reasons.push('precipitation present');
  } else {
    reasons.push('no precipitation');
  }

  return { name: 'Skiing', score, reason: reasons.join(', ') };
}

function scoreSurfing(weather: WeatherData): Activity {
  let score = 0;
  const reasons: string[] = [];

  if (weather.temperature > 20) {
    score += 40;
    reasons.push('warm temperature');
  } else if (weather.temperature > 15) {
    score += 25;
    reasons.push('moderate temperature');
  } else {
    score += 10;
    reasons.push('cold temperature');
  }

  if (weather.windSpeed > 10 && weather.windSpeed < 30) {
    score += 40;
    reasons.push('good wind conditions');
  } else {
    score += 10;
    reasons.push('suboptimal wind');
  }

  if (weather.precipitation === 0) {
    score += 20;
    reasons.push('no rain');
  } else {
    reasons.push('rainy conditions');
  }

  return { name: 'Surfing', score, reason: reasons.join(', ') };
}

function scoreIndoorSightseeing(weather: WeatherData): Activity {
  let score = 50;
  const reasons: string[] = ['always available'];

  if (weather.precipitation > 5) {
    score += 30;
    reasons.push('heavy rain');
  } else if (weather.precipitation > 0) {
    score += 20;
    reasons.push('light rain');
  }

  if (weather.temperature < 5) {
    score += 20;
    reasons.push('very cold outside');
  } else if (weather.temperature > 35) {
    score += 20;
    reasons.push('very hot outside');
  }

  return { name: 'Indoor Sightseeing', score, reason: reasons.join(', ') };
}

function scoreOutdoorSightseeing(weather: WeatherData): Activity {
  let score = 0;
  const reasons: string[] = [];

  if (weather.temperature > 15 && weather.temperature < 25) {
    score += 50;
    reasons.push('perfect temperature');
  } else if (weather.temperature > 10 && weather.temperature < 30) {
    score += 30;
    reasons.push('comfortable temperature');
  } else {
    score += 10;
    reasons.push('temperature not ideal');
  }

  // No rain is preferred - rain significantly reduces outdoor appeal
  if (weather.precipitation === 0) {
    score += 30;
    reasons.push('clear weather');
  } else if (weather.precipitation < 2) {
    score += 5;
    reasons.push('light rain');
  } else {
    // No points for moderate/heavy rain
    reasons.push('rainy');
  }

  // Light wind is good
  if (weather.windSpeed < 20) {
    score += 20;
    reasons.push('calm winds');
  } else {
    // No points for strong wind
    reasons.push('windy');
  }

  return { name: 'Outdoor Sightseeing', score, reason: reasons.join(', ') };
}

export function ActivitiesDisplay({ latitude, longitude, forecastData }: ActivitiesDisplayProps) {
  const { data, loading, error } = useQuery<GetActivitiesData>(GET_ACTIVITIES, {
    variables: { latitude, longitude },
    skip: !!forecastData, // Skip query if we have forecast data
  });

  // Calculate activities from forecast data if available
  const calculatedActivities = useMemo(() => {
    if (!forecastData) return null;

    // Use average temperature from forecast
    const avgTemp = (forecastData.temperatureMax + forecastData.temperatureMin) / 2;
    const weather = {
      temperature: avgTemp,
      windSpeed: forecastData.windSpeed,
      precipitation: forecastData.precipitation,
      condition: forecastData.condition,
    };

    return [
      scoreSkiing(weather),
      scoreSurfing(weather),
      scoreIndoorSightseeing(weather),
      scoreOutdoorSightseeing(weather),
    ].sort((a, b) => b.score - a.score);
  }, [forecastData]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Activity Rankings</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 rounded-lg shadow-lg p-6">
        <p className="text-red-700 dark:text-red-100">Error loading activities</p>
      </div>
    );
  }

  const activities = calculatedActivities || data?.getActivities;

  if (!activities) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
        Activity Rankings {forecastData && `- ${new Date(forecastData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Sorted from highest to lowest percentage
      </p>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {activity.name}
              </h4>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {activity.score}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all ${getScoreColor(activity.score)}`}
                style={{ width: `${activity.score}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
