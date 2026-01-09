export interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  high: number;
  low: number;
  feelsLike: number;
  uvIndex: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  precipitation: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  humidity: number;
}

export interface SavedLocation {
  id: string;
  city: string;
  country: string;
  isFavorite: boolean;
}
