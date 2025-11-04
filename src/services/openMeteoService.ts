import axios from 'axios';

// OpenMeteo API base URLs from environment variables
// Validate that required environment variables are set
if (!process.env.NEXT_PUBLIC_GEOCODING_API) {
  throw new Error('NEXT_PUBLIC_GEOCODING_API environment variable is not set');
}

if (!process.env.NEXT_PUBLIC_WEATHER_API) {
  throw new Error('NEXT_PUBLIC_WEATHER_API environment variable is not set');
}

const GEOCODING_API: string = process.env.NEXT_PUBLIC_GEOCODING_API;
const WEATHER_API: string = process.env.NEXT_PUBLIC_WEATHER_API;

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

interface ForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    wind_speed_10m_max: number[];
    precipitation_sum: number[];
  };
}

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
}

interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
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
  const reasons: string[] = [];

  // Cold temperature is good for skiing
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

  // Precipitation (snow) is good
  if (weather.precipitation > 0) {
    score += 30;
    reasons.push('precipitation present');
  } else {
    reasons.push('no precipitation');
  }

  return {
    name: 'Skiing',
    score,
    reason: reasons.join(', ')
  };
}

function scoreSurfing(weather: WeatherData) {
  let score = 0;
  const reasons: string[] = [];

  // Warm temperature is good for surfing
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

  // Moderate wind is good for surfing
  if (weather.windSpeed > 10 && weather.windSpeed < 30) {
    score += 40;
    reasons.push('good wind conditions');
  } else {
    score += 10;
    reasons.push('suboptimal wind');
  }

  // No heavy rain preferred
  if (weather.precipitation === 0) {
    score += 20;
    reasons.push('no rain');
  } else {
    reasons.push('rainy conditions');
  }

  return {
    name: 'Surfing',
    score,
    reason: reasons.join(', ')
  };
}

function scoreIndoorSightseeing(weather: WeatherData) {
  let score = 50; // Baseline score (always an option)
  const reasons: string[] = ['always available'];

  // Bad weather makes indoor activities better
  if (weather.precipitation > 5) {
    score += 30;
    reasons.push('heavy rain');
  } else if (weather.precipitation > 0) {
    score += 20;
    reasons.push('light rain');
  }

  // Extreme temperatures favor indoor
  if (weather.temperature < 5) {
    score += 20;
    reasons.push('very cold outside');
  } else if (weather.temperature > 35) {
    score += 20;
    reasons.push('very hot outside');
  }

  return {
    name: 'Indoor Sightseeing',
    score,
    reason: reasons.join(', ')
  };
}

function scoreOutdoorSightseeing(weather: WeatherData) {
  let score = 0;
  const reasons: string[] = [];

  // Pleasant temperature is ideal
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

  // No rain is preferred
  if (weather.precipitation === 0) {
    score += 30;
    reasons.push('clear weather');
  } else {
    score += 5;
    reasons.push('rainy');
  }

  // Light wind is good
  if (weather.windSpeed < 20) {
    score += 20;
    reasons.push('light wind');
  } else {
    score += 5;
    reasons.push('strong wind');
  }

  return {
    name: 'Outdoor Sightseeing',
    score,
    reason: reasons.join(', ')
  };
}

// Get 7-day weather forecast for a location
// Returns array of daily forecasts
export async function get7DayForecast(latitude: number, longitude: number): Promise<DailyForecast[]> {
  try {
    const response = await axios.get<ForecastResponse>(WEATHER_API, {
      params: {
        latitude,
        longitude,
        daily: 'temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum',
        timezone: 'auto',
        forecast_days: 7,
      },
    });

    const daily = response.data.daily;

    // Map API response to our DailyForecast type
    return daily.time.map((date, index) => {
      const precipitation = daily.precipitation_sum[index];

      // Determine weather condition based on precipitation
      let condition = 'Sunny';
      if (precipitation > 0) {
        condition = 'Rainy';
      }

      return {
        date,
        temperatureMax: daily.temperature_2m_max[index],
        temperatureMin: daily.temperature_2m_min[index],
        windSpeed: daily.wind_speed_10m_max[index],
        precipitation,
        condition,
      };
    });
  } catch (error) {
    console.error('Error fetching 7-day forecast:', error);
    throw new Error('Failed to fetch 7-day forecast');
  }
}
