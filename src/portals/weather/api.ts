// Weather API utilities
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface LocationSearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherAPIResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
}

// Search for locations by city name
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to search locations');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

// Get current weather by coordinates
export async function getCurrentWeather(lat: number, lon: number, unit: 'F' | 'C' = 'F') {
  try {
    const units = unit === 'F' ? 'imperial' : 'metric';
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch weather');
    
    const data: WeatherAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

// Get hourly forecast
export async function getHourlyForecast(lat: number, lon: number, unit: 'F' | 'C' = 'F') {
  try {
    const units = unit === 'F' ? 'imperial' : 'metric';
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch forecast');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

// Format timestamp to time string
export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
