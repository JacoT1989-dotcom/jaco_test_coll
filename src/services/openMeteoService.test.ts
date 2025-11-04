import { searchCities, getWeatherForecast, rankActivities, get7DayForecast } from './openMeteoService';

describe('OpenMeteo Service', () => {
  describe('searchCities', () => {
    it('should return cities matching the query', async () => {
      const cities = await searchCities('London');

      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
    });
  });

  describe('getWeatherForecast', () => {
    it('should return weather data for valid coordinates', async () => {
      // London coordinates: 51.5074° N, 0.1278° W
      const weather = await getWeatherForecast(51.5074, -0.1278);

      expect(weather).toHaveProperty('temperature');
      expect(weather).toHaveProperty('condition');
      expect(weather).toHaveProperty('windSpeed');
      expect(weather).toHaveProperty('precipitation');
      expect(typeof weather.temperature).toBe('number');
      expect(typeof weather.windSpeed).toBe('number');
      expect(typeof weather.precipitation).toBe('number');
    });
  });

  describe('rankActivities', () => {
    it('should return ranked activities array', async () => {
      // London coordinates
      const activities = await rankActivities(51.5074, -0.1278);

      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);
      expect(activities[0]).toHaveProperty('name');
      expect(activities[0]).toHaveProperty('score');
      expect(activities[0]).toHaveProperty('reason');
    });

    it('should rank activities by score (highest first)', async () => {
      const activities = await rankActivities(51.5074, -0.1278);

      // Check that activities are sorted in descending order
      for (let i = 0; i < activities.length - 1; i++) {
        expect(activities[i].score).toBeGreaterThanOrEqual(activities[i + 1].score);
      }
    });
  });

  describe('get7DayForecast', () => {
    it('should return 7-day forecast array', async () => {
      // London coordinates
      const forecast = await get7DayForecast(51.5074, -0.1278);

      expect(Array.isArray(forecast)).toBe(true);
      expect(forecast.length).toBe(7);
      expect(forecast[0]).toHaveProperty('date');
      expect(forecast[0]).toHaveProperty('temperatureMax');
      expect(forecast[0]).toHaveProperty('temperatureMin');
      expect(forecast[0]).toHaveProperty('windSpeed');
      expect(forecast[0]).toHaveProperty('precipitation');
      expect(forecast[0]).toHaveProperty('condition');
    });

    it('should return valid forecast data types', async () => {
      const forecast = await get7DayForecast(51.5074, -0.1278);

      forecast.forEach((day) => {
        expect(typeof day.date).toBe('string');
        expect(typeof day.temperatureMax).toBe('number');
        expect(typeof day.temperatureMin).toBe('number');
        expect(typeof day.windSpeed).toBe('number');
        expect(typeof day.precipitation).toBe('number');
        expect(typeof day.condition).toBe('string');
      });
    });
  });
});
