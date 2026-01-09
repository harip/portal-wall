import { create } from 'zustand';
import { WeatherData, HourlyForecast, DailyForecast, SavedLocation } from './types';

interface WeatherStore {
  currentWeather: WeatherData | null;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  savedLocations: SavedLocation[];
  activeLocationId: string;
  temperatureUnit: 'F' | 'C';
  loading: boolean;
  
  setCurrentWeather: (weather: WeatherData) => void;
  setHourlyForecast: (forecast: HourlyForecast[]) => void;
  setDailyForecast: (forecast: DailyForecast[]) => void;
  addLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
  setActiveLocation: (id: string) => void;
  toggleTemperatureUnit: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data generator
const generateMockWeather = (): WeatherData => ({
  location: 'San Francisco, CA',
  temp: 72,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  high: 75,
  low: 62,
  feelsLike: 71,
  uvIndex: 6,
  pressure: 30.1,
  sunrise: '6:45 AM',
  sunset: '7:30 PM',
});

const generateMockHourly = (): HourlyForecast[] => [
  { time: '12 PM', temp: 70, condition: 'sunny', precipitation: 0 },
  { time: '1 PM', temp: 71, condition: 'sunny', precipitation: 0 },
  { time: '2 PM', temp: 72, condition: 'cloudy', precipitation: 5 },
  { time: '3 PM', temp: 73, condition: 'cloudy', precipitation: 10 },
  { time: '4 PM', temp: 72, condition: 'cloudy', precipitation: 15 },
  { time: '5 PM', temp: 70, condition: 'rainy', precipitation: 40 },
  { time: '6 PM', temp: 68, condition: 'rainy', precipitation: 60 },
  { time: '7 PM', temp: 66, condition: 'cloudy', precipitation: 20 },
];

const generateMockDaily = (): DailyForecast[] => [
  { day: 'Monday', date: 'Jan 9', high: 75, low: 62, condition: 'sunny', precipitation: 0, humidity: 65 },
  { day: 'Tuesday', date: 'Jan 10', high: 73, low: 61, condition: 'cloudy', precipitation: 10, humidity: 70 },
  { day: 'Wednesday', date: 'Jan 11', high: 70, low: 59, condition: 'rainy', precipitation: 80, humidity: 85 },
  { day: 'Thursday', date: 'Jan 12', high: 72, low: 60, condition: 'sunny', precipitation: 5, humidity: 60 },
  { day: 'Friday', date: 'Jan 13', high: 74, low: 63, condition: 'cloudy', precipitation: 15, humidity: 68 },
  { day: 'Saturday', date: 'Jan 14', high: 76, low: 64, condition: 'sunny', precipitation: 0, humidity: 55 },
  { day: 'Sunday', date: 'Jan 15', high: 77, low: 65, condition: 'sunny', precipitation: 0, humidity: 58 },
];

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentWeather: generateMockWeather(),
  hourlyForecast: generateMockHourly(),
  dailyForecast: generateMockDaily(),
  savedLocations: [
    { id: '1', city: 'San Francisco', country: 'USA', isFavorite: true },
    { id: '2', city: 'New York', country: 'USA', isFavorite: false },
    { id: '3', city: 'London', country: 'UK', isFavorite: false },
  ],
  activeLocationId: '1',
  temperatureUnit: 'F',
  loading: false,

  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  setHourlyForecast: (forecast) => set({ hourlyForecast: forecast }),
  setDailyForecast: (forecast) => set({ dailyForecast: forecast }),
  addLocation: (location) => set((state) => ({ 
    savedLocations: [...state.savedLocations, location] 
  })),
  removeLocation: (id) => set((state) => ({ 
    savedLocations: state.savedLocations.filter(l => l.id !== id) 
  })),
  setActiveLocation: (id) => set({ activeLocationId: id }),
  toggleTemperatureUnit: () => set((state) => ({ 
    temperatureUnit: state.temperatureUnit === 'F' ? 'C' : 'F' 
  })),
  setLoading: (loading) => set({ loading }),
}));
