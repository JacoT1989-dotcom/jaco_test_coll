import axios from 'axios';

interface GeolocationResponse {
  city: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

/**
 * Get user's location based on their IP address
 * Uses ipapi.co free API (no key required, 1000 requests/day)
 */
export async function getUserLocationFromIP(): Promise<{
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}> {
  try {
    // Using ipapi.co - free tier allows 1000 requests per day
    const response = await axios.get<GeolocationResponse>(
      'https://ipapi.co/json/',
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'Travel-Weather-App/1.0',
        },
      }
    );

    const { city, country_name, latitude, longitude } = response.data;

    return {
      name: city || 'Unknown City',
      country: country_name || 'Unknown Country',
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Error fetching user location from IP:', error);

    // Fallback to a default location (e.g., London) if geolocation fails
    return {
      name: 'London',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
    };
  }
}
