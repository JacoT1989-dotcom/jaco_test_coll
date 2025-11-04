import { searchCities, getWeatherForecast, rankActivities, get7DayForecast } from '../services/openMeteoService';
import { getUserLocationFromIP } from '../services/ipGeolocationService';

// Define argument types for each resolver
interface SearchCitiesArgs {
  query: string;
}

interface LocationArgs {
  latitude: number;
  longitude: number;
}

// Resolvers - Functions that fetch data for each query
export const resolvers = {
  Query: {
    // Search for cities by name
    // Args: { query: string } - partial or complete city name
    // Returns: Array of City objects
    searchCities: async (_: unknown, { query }: SearchCitiesArgs) => {
      return await searchCities(query);
    },

    // Get weather forecast for a location
    // Args: { latitude: number, longitude: number }
    // Returns: Weather object
    getWeather: async (_: unknown, { latitude, longitude }: LocationArgs) => {
      return await getWeatherForecast(latitude, longitude);
    },

    // Get ranked activities based on weather
    // Args: { latitude: number, longitude: number }
    // Returns: Array of Activity objects (sorted by score)
    getActivities: async (_: unknown, { latitude, longitude }: LocationArgs) => {
      return await rankActivities(latitude, longitude);
    },

    // Get 7-day weather forecast
    // Args: { latitude: number, longitude: number }
    // Returns: Array of DailyForecast objects
    get7DayForecast: async (_: unknown, { latitude, longitude }: LocationArgs) => {
      return await get7DayForecast(latitude, longitude);
    },

    // Get user's location based on IP address
    // No args - automatically detects location
    // Returns: City object with user's current location
    getUserLocation: async () => {
      return await getUserLocationFromIP();
    },
  },
};
