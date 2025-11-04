import axios from 'axios';

// OpenMeteo API base URLs
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// TypeScript interfaces for API responses and weather data
interface CityResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface GeocodingResponse {
  results?: CityResult[];
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    precipitation: number;
  };
}

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
}

// Search for cities by name
// Returns array of cities matching the query
export async function searchCities(query: string) {
  try {
    const response = await axios.get<GeocodingResponse>(GEOCODING_API, {
      params: {
        name: query,
        count: 10,        // Limit to 10 results
        language: 'en',
        format: 'json',
      },
    });

    // If no results found
    if (!response.data.results) {
      return [];
    }

    // Map API response to our City type
    return response.data.results.map((city: CityResult) => ({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error('Failed to search cities');
  }
}

// Get weather forecast for a location
// Returns weather data (temperature, condition, wind, precipitation)
export async function getWeatherForecast(latitude: number, longitude: number) {
  try {
    const response = await axios.get<WeatherResponse>(WEATHER_API, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,wind_speed_10m,precipitation',
        timezone: 'auto',
      },
    });

    const current = response.data.current;

    // Determine weather condition based on precipitation
    let condition = 'Sunny';
    if (current.precipitation > 0) {
      condition = 'Rainy';
    }

    return {
      temperature: current.temperature_2m,
      condition,
      windSpeed: current.wind_speed_10m,
      precipitation: current.precipitation,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather data');
  }
}

// Rank activities based on weather conditions
// Returns array of activities sorted by score (best to worst)
export async function rankActivities(latitude: number, longitude: number) {
  try {
    const weather = await getWeatherForecast(latitude, longitude);

    const activities = [
      scoreSkiing(weather),
      scoreSurfing(weather),
      scoreIndoorSightseeing(weather),
      scoreOutdoorSightseeing(weather),
    ];

    // Sort by score (highest first)
    return activities.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error ranking activities:', error);
    throw new Error('Failed to rank activities');
  }
}

// Scoring functions for each activity
// Each returns an activity object with name, score (0-100), and reason

function scoreSkiing(weather: WeatherData) {
  let score = 0;
  let reason = '';

  // Cold temperature is good for skiing
  if (weather.temperature < 0) {
    score += 50;
    reason = 'Cold temperature ideal for skiing';
  } else if (weather.temperature < 10) {
    score += 30;
    reason = 'Cool temperature suitable for skiing';
  } else {
    score += 10;
    reason = 'Temperature too warm for skiing';
  }

  // Precipitation (snow) is good
  if (weather.precipitation > 0) {
    score += 30;
  }

  return { name: 'Skiing', score, reason };
}

function scoreSurfing(weather: WeatherData) {
  let score = 0;
  let reason = '';

  // Warm temperature is good for surfing
  if (weather.temperature > 20) {
    score += 40;
    reason = 'Warm temperature perfect for surfing';
  } else if (weather.temperature > 15) {
    score += 25;
    reason = 'Moderate temperature for surfing';
  } else {
    score += 10;
    reason = 'Too cold for surfing';
  }

  // Moderate wind is good for surfing
  if (weather.windSpeed > 10 && weather.windSpeed < 30) {
    score += 40;
  } else {
    score += 10;
  }

  // No heavy rain preferred
  if (weather.precipitation === 0) {
    score += 20;
  }

  return { name: 'Surfing', score, reason };
}

function scoreIndoorSightseeing(weather: WeatherData) {
  let score = 50; // Baseline score (always an option)
  let reason = 'Good indoor activity option';

  // Bad weather makes indoor activities better
  if (weather.precipitation > 5) {
    score += 30;
    reason = 'Heavy rain - perfect for indoor activities';
  } else if (weather.precipitation > 0) {
    score += 20;
    reason = 'Light rain - good for indoor activities';
  }

  // Extreme temperatures favor indoor
  if (weather.temperature < 5 || weather.temperature > 35) {
    score += 20;
  }

  return { name: 'Indoor Sightseeing', score, reason };
}

function scoreOutdoorSightseeing(weather: WeatherData) {
  let score = 0;
  let reason = '';

  // Pleasant temperature is ideal
  if (weather.temperature > 15 && weather.temperature < 25) {
    score += 50;
    reason = 'Perfect temperature for outdoor activities';
  } else if (weather.temperature > 10 && weather.temperature < 30) {
    score += 30;
    reason = 'Comfortable temperature for outdoor activities';
  } else {
    score += 10;
    reason = 'Temperature not ideal for outdoor activities';
  }

  // No rain is preferred
  if (weather.precipitation === 0) {
    score += 30;
  } else {
    score += 5;
  }

  // Light wind is good
  if (weather.windSpeed < 20) {
    score += 20;
  } else {
    score += 5;
  }

  return { name: 'Outdoor Sightseeing', score, reason };
}
