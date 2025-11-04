import { gql } from 'graphql-tag';

// GraphQL Schema - Defines what data clients can request
export const typeDefs = gql`
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

  # DailyForecast type - represents forecast for a single day
  type DailyForecast {
    date: String!           # Date in YYYY-MM-DD format
    temperatureMax: Float!  # Max temperature in Celsius
    temperatureMin: Float!  # Min temperature in Celsius
    windSpeed: Float!       # Max wind speed in km/h
    precipitation: Float!   # Total precipitation in mm
    condition: String!      # Weather condition (sunny, rainy, etc.)
  }

  # Query type - defines what clients can request
  type Query {
    # Search for cities by partial name
    searchCities(query: String!): [City!]!

    # Get weather forecast for a city
    getWeather(latitude: Float!, longitude: Float!): Weather!

    # Get ranked activities based on weather
    getActivities(latitude: Float!, longitude: Float!): [Activity!]!

    # Get 7-day weather forecast
    get7DayForecast(latitude: Float!, longitude: Float!): [DailyForecast!]!

    # Get user's location based on IP address
    getUserLocation: City!
  }
`;
