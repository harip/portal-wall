export interface ClockLocation {
  id: string;
  city: string;
  country: string;
  timezone: string;
  offset: number; // offset from UTC in minutes
}

export interface Reminder {
  id: string;
  locationId: string;
  locationName: string;
  timezone: string;
  dateTime: string; // ISO string
  description: string;
  notify: boolean;
  notified: boolean;
}
