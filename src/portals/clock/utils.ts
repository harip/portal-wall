// Timezone data for major cities
interface TimezoneData {
  city: string;
  country: string;
  timezone: string;
}

export const TIMEZONES: TimezoneData[] = [
  // Americas
  { city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { city: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  { city: 'Denver', country: 'USA', timezone: 'America/Denver' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  
  // Europe
  { city: 'London', country: 'UK', timezone: 'Europe/London' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  
  // Asia
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  
  // Oceania
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  
  // Africa
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
];

export function searchTimezones(query: string): TimezoneData[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return TIMEZONES.filter(
    tz =>
      tz.city.toLowerCase().includes(lowerQuery) ||
      tz.country.toLowerCase().includes(lowerQuery)
  );
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
