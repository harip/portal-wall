import { create } from 'zustand';
import { WeatherData, HourlyForecast, DailyForecast, SavedLocation } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';
import { getCurrentWeather, getHourlyForecast, formatTime } from './api';

interface WeatherStore {
  currentWeather: WeatherData | null;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  savedLocations: SavedLocation[];
  activeLocationId: string;
  temperatureUnit: 'F' | 'C';
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  
  setHydrated: () => void;
  addLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
  setActiveLocation: (id: string) => void;
  toggleTemperatureUnit: () => void;
  fetchWeatherForLocation: (locationId: string) => Promise<void>;
}

// Default location
const defaultLocation: SavedLocation = {
  id: '1',
  city: 'San Francisco',
  country: 'US',
  lat: 37.7749,
  lon: -122.4194,
  isFavorite: true,
};

// Save to localStorage
const saveWeatherSettings = (locations: SavedLocation[], activeId: string, unit: 'F' | 'C') => {
  setPortalData('weather', {
    locations: locations.map(({ id, city, country, state, lat, lon }) => ({ 
      id, city, country, state, lat, lon 
    })),
    activeLocationId: activeId,
    unit,
  });
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  hourlyForecast: [],
  dailyForecast: [],
  savedLocations: [defaultLocation],
  activeLocationId: '1',
  temperatureUnit: 'F',
  loading: false,
  error: null,
  hydrated: false,

  setHydrated: () => {
    const stored = getPortalData<{
      locations: Array<{ id: string; city: string; country: string; state?: string; lat?: number; lon?: number }>;
      activeLocationId: string;
      unit: 'F' | 'C';
    }>('weather');

    // Check if stored data has valid locations with lat/lon
    const hasValidLocations = stored && 
      stored.locations.length > 0 && 
      stored.locations.every(loc => typeof loc.lat === 'number' && typeof loc.lon === 'number');

    if (hasValidLocations) {
      const locations = stored.locations.map(loc => ({
        ...loc,
        lat: loc.lat!,
        lon: loc.lon!,
        isFavorite: loc.id === stored.activeLocationId,
      }));
      set({
        savedLocations: locations,
        activeLocationId: stored.activeLocationId,
        temperatureUnit: stored.unit,
        hydrated: true,
      });
      
      // Fetch weather for active location
      get().fetchWeatherForLocation(stored.activeLocationId);
    } else {
      // First time or invalid data - use defaults and clear old data
      set({
        savedLocations: [defaultLocation],
        activeLocationId: '1',
        temperatureUnit: 'F',
        hydrated: true,
      });
      saveWeatherSettings([defaultLocation], '1', 'F');
      get().fetchWeatherForLocation('1');
    }
  },
  
  addLocation: (location) => {
    const newLocations = [...get().savedLocations, location];
    set({ savedLocations: newLocations });
    saveWeatherSettings(newLocations, get().activeLocationId, get().temperatureUnit);
  },
  
  removeLocation: (id) => {
    const newLocations = get().savedLocations.filter(l => l.id !== id);
    let newActiveId = get().activeLocationId;
    
    // If removing active location, switch to first available
    if (id === newActiveId && newLocations.length > 0) {
      newActiveId = newLocations[0].id;
      get().fetchWeatherForLocation(newActiveId);
    }
    
    set({ 
      savedLocations: newLocations,
      activeLocationId: newActiveId,
    });
    saveWeatherSettings(newLocations, newActiveId, get().temperatureUnit);
  },
  
  setActiveLocation: (id) => {
    set({ activeLocationId: id });
    saveWeatherSettings(get().savedLocations, id, get().temperatureUnit);
    get().fetchWeatherForLocation(id);
  },
  
  toggleTemperatureUnit: () => {
    const newUnit = get().temperatureUnit === 'F' ? 'C' : 'F';
    set({ temperatureUnit: newUnit });
    saveWeatherSettings(get().savedLocations, get().activeLocationId, newUnit);
    // Refetch with new unit
    get().fetchWeatherForLocation(get().activeLocationId);
  },

  fetchWeatherForLocation: async (locationId: string) => {
    const location = get().savedLocations.find(l => l.id === locationId);
    if (!location) return;
    
    set({ loading: true, error: null });
    
    try {
      const unit = get().temperatureUnit;
      
      // Fetch current weather
      const currentData = await getCurrentWeather(location.lat, location.lon, unit);
      
      // Fetch hourly forecast
      const forecastData = await getHourlyForecast(location.lat, location.lon, unit);
      
      // Transform current weather
      const currentWeather: WeatherData = {
        location: `${location.city}, ${location.country}`,
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed),
        visibility: Math.round(currentData.visibility / 1609), // meters to miles
        high: Math.round(currentData.main.temp_max),
        low: Math.round(currentData.main.temp_min),
        feelsLike: Math.round(currentData.main.feels_like),
        uvIndex: 0, // Not available in free tier
        pressure: Math.round(currentData.main.pressure * 0.02953), // hPa to inHg
        sunrise: formatTime(currentData.sys.sunrise),
        sunset: formatTime(currentData.sys.sunset),
      };
      
      // Transform hourly forecast (next 8 hours)
      const hourlyForecast: HourlyForecast[] = forecastData.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric',
          hour12: true 
        }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main.toLowerCase(),
        precipitation: item.pop ? Math.round(item.pop * 100) : 0,
      }));
      
      // Transform daily forecast (next 7 days)
      const dailyData = forecastData.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 7);
      const dailyForecast: DailyForecast[] = dailyData.map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main.toLowerCase(),
          precipitation: item.pop ? Math.round(item.pop * 100) : 0,
          humidity: item.main.humidity,
        };
      });
      
      set({
        currentWeather,
        hourlyForecast,
        dailyForecast,
        loading: false,
      });
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      set({ 
        error: 'Failed to fetch weather data. Please check your API key.',
        loading: false 
      });
    }
  },
}));
