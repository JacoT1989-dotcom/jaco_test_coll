"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const openMeteoService_1 = require("../services/openMeteoService");
// Resolvers - Functions that fetch data for each query
exports.resolvers = {
    Query: {
        // Search for cities by name
        // Args: { query: string } - partial or complete city name
        // Returns: Array of City objects
        searchCities: async (_, { query }) => {
            return await (0, openMeteoService_1.searchCities)(query);
        },
        // Get weather forecast for a location
        // Args: { latitude: number, longitude: number }
        // Returns: Weather object
        getWeather: async (_, { latitude, longitude }) => {
            return await (0, openMeteoService_1.getWeatherForecast)(latitude, longitude);
        },
        // Get ranked activities based on weather
        // Args: { latitude: number, longitude: number }
        // Returns: Array of Activity objects (sorted by score)
        getActivities: async (_, { latitude, longitude }) => {
            return await (0, openMeteoService_1.rankActivities)(latitude, longitude);
        },
    },
};
