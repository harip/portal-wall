// Timezone data interface
export interface TimezoneData {
  city: string;
  country: string;
  timezone: string;
  lat: number;
  lon: number;
}

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Timezone data from OpenWeatherMap API
export async function searchTimezones(query: string): Promise<TimezoneData[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Convert geocoding results to timezone data with detected timezone
    return data.map((location: any) => ({
      city: location.name,
      country: location.country,
      timezone: getTimezoneFromCoords(location.lat, location.lon),
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

// Get IANA timezone from coordinates using Intl API
function getTimezoneFromCoords(lat: number, lon: number): string {
  // Use a more comprehensive timezone detection
  // For now, we'll use the browser's Intl API with a fallback
  try {
    // This is a simplified version - ideally you'd use a timezone lookup library
    // For now, we'll use major timezone regions based on longitude
    const timezoneMap: { [key: string]: string } = {
      'US': 'America/New_York',
      'CA': 'America/Toronto',
      'MX': 'America/Mexico_City',
      'BR': 'America/Sao_Paulo',
      'GB': 'Europe/London',
      'FR': 'Europe/Paris',
      'DE': 'Europe/Berlin',
      'ES': 'Europe/Madrid',
      'IT': 'Europe/Rome',
      'NL': 'Europe/Amsterdam',
      'RU': 'Europe/Moscow',
      'AE': 'Asia/Dubai',
      'IN': 'Asia/Kolkata',
      'SG': 'Asia/Singapore',
      'HK': 'Asia/Hong_Kong',
      'JP': 'Asia/Tokyo',
      'KR': 'Asia/Seoul',
      'CN': 'Asia/Shanghai',
      'TH': 'Asia/Bangkok',
      'AU': 'Australia/Sydney',
      'NZ': 'Pacific/Auckland',
      'EG': 'Africa/Cairo',
      'NG': 'Africa/Lagos',
      'ZA': 'Africa/Johannesburg',
    };
    
    // Simple approximation based on longitude
    // This is a rough estimate - ideally you'd use a proper timezone database
    const hour = lon / 15; // Rough conversion
    
    if (lon >= -135 && lon < -105) return 'America/Los_Angeles';
    if (lon >= -105 && lon < -90) return 'America/Denver';
    if (lon >= -90 && lon < -75) return 'America/Chicago';
    if (lon >= -75 && lon < -60) return 'America/New_York';
    if (lon >= -60 && lon < -30) return 'America/Sao_Paulo';
    if (lon >= -30 && lon < 15) return 'Europe/London';
    if (lon >= 15 && lon < 30) return 'Europe/Paris';
    if (lon >= 30 && lon < 45) return 'Europe/Moscow';
    if (lon >= 45 && lon < 75) return 'Asia/Dubai';
    if (lon >= 75 && lon < 90) return 'Asia/Kolkata';
    if (lon >= 90 && lon < 105) return 'Asia/Bangkok';
    if (lon >= 105 && lon < 120) return 'Asia/Shanghai';
    if (lon >= 120 && lon < 135) return 'Asia/Tokyo';
    if (lon >= 135 && lon < 165) return 'Australia/Sydney';
    if (lon >= 165 || lon < -165) return 'Pacific/Auckland';
    
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

export function getTimeInTimezone(timezone: string): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
}

export function getTimezoneOffset(timezone: string): number {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

export function formatTime(date: Date, use24Hour: boolean = false): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
