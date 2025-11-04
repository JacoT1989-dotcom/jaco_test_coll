import { searchCities, getWeatherForecast, rankActivities } from '../services/openMeteoService';

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
  },
};
