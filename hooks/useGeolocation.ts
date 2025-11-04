import { useState, useEffect } from 'react';
import axios from 'axios';

interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface GeolocationState {
  location: City | null;
  loading: boolean;
  error: Error | null;
}

interface IpApiResponse {
  city: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

/**
 * Custom hook to detect user's location from their IP address
 * Runs on the client-side (browser) to get the actual user's IP
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchLocation() {
      try {
        // Call IP geolocation API directly from the browser
        const response = await axios.get<IpApiResponse>('https://ipapi.co/json/', {
          timeout: 5000,
          headers: {
            'User-Agent': 'Travel-Weather-App/1.0',
          },
        });

        const { city, country_name, latitude, longitude } = response.data;

        if (isMounted) {
          setState({
            location: {
              name: city || 'Unknown City',
              country: country_name || 'Unknown Country',
              latitude,
              longitude,
            },
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user location:', error);

        // Fallback to London if geolocation fails
        if (isMounted) {
          setState({
            location: {
              name: 'London',
              country: 'United Kingdom',
              latitude: 51.5074,
              longitude: -0.1278,
            },
            loading: false,
            error: error instanceof Error ? error : new Error('Failed to fetch location'),
          });
        }
      }
    }

    fetchLocation();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  return state;
}
