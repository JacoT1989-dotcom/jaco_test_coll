import { searchCities, getWeatherForecast, rankActivities } from './openMeteoService';

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
});
