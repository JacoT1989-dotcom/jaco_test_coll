import { gql } from '@apollo/client';

export const SEARCH_CITIES = gql`
  query SearchCities($query: String!) {
    searchCities(query: $query) {
      name
      latitude
      longitude
      country
    }
  }
`;

export const GET_WEATHER = gql`
  query GetWeather($latitude: Float!, $longitude: Float!) {
    getWeather(latitude: $latitude, longitude: $longitude) {
      temperature
      condition
      windSpeed
      precipitation
    }
  }
`;

export const GET_7_DAY_FORECAST = gql`
  query Get7DayForecast($latitude: Float!, $longitude: Float!) {
    get7DayForecast(latitude: $latitude, longitude: $longitude) {
      date
      temperatureMax
      temperatureMin
      windSpeed
      precipitation
      condition
    }
  }
`;

export const GET_ACTIVITIES = gql`
  query GetActivities($latitude: Float!, $longitude: Float!) {
    getActivities(latitude: $latitude, longitude: $longitude) {
      name
      score
      reason
    }
  }
`;

export const GET_USER_LOCATION = gql`
  query GetUserLocation {
    getUserLocation {
      name
      latitude
      longitude
      country
    }
  }
`;
