"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
// GraphQL Schema - Defines what data clients can request
exports.typeDefs = (0, graphql_tag_1.gql) `
  # City type - represents a city location
  type City {
    name: String!           # City name (! means required)
    latitude: Float!        # Latitude coordinate
    longitude: Float!       # Longitude coordinate
    country: String!        # Country name
  }

  # Weather type - represents weather forecast
  type Weather {
    temperature: Float!     # Temperature in Celsius
    condition: String!      # Weather condition (sunny, rainy, etc.)
    windSpeed: Float!       # Wind speed in km/h
    precipitation: Float!   # Precipitation in mm
  }

  # Activity type - represents a ranked activity
  type Activity {
    name: String!           # Activity name
    score: Float!           # Ranking score (0-100)
    reason: String!         # Why this score
  }

  # Query type - defines what clients can request
  type Query {
    # Search for cities by partial name
    searchCities(query: String!): [City!]!

    # Get weather forecast for a city
    getWeather(latitude: Float!, longitude: Float!): Weather!

    # Get ranked activities based on weather
    getActivities(latitude: Float!, longitude: Float!): [Activity!]!
  }
`;
