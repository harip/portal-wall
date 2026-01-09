export type UnitType = 'length' | 'weight' | 'temperature' | 'volume' | 'time' | 'currency';

export interface Conversion {
  id: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  unitType: UnitType;
  createdAt: number;
}

export interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: (value: number) => number; // Convert to base unit
  fromBase: (value: number) => number; // Convert from base unit
}

export const UNIT_DEFINITIONS: Record<UnitType, Record<string, UnitDefinition>> = {
  length: {
    meter: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    kilometer: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    centimeter: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    millimeter: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    inch: { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    foot: { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    yard: { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    mile: { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
  },
  weight: {
    kilogram: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    gram: { name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    milligram: { name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    pound: { name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    ounce: { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    ton: { name: 'Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  temperature: {
    celsius: { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    fahrenheit: { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    kelvin: { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  volume: {
    liter: { name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
    milliliter: { name: 'Milliliter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    gallon: { name: 'Gallon (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    quart: { name: 'Quart', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    pint: { name: 'Pint', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    cup: { name: 'Cup', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    fluidOunce: { name: 'Fluid Ounce', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  },
  time: {
    second: { name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
    minute: { name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    hour: { name: 'Hour', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    day: { name: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    week: { name: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    month: { name: 'Month', symbol: 'mo', toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
    year: { name: 'Year', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
  },
  currency: {
    usd: { name: 'US Dollar', symbol: 'USD', toBase: (v) => v, fromBase: (v) => v },
    eur: { name: 'Euro', symbol: 'EUR', toBase: (v) => v * 0.92, fromBase: (v) => v / 0.92 },
    gbp: { name: 'British Pound', symbol: 'GBP', toBase: (v) => v * 0.79, fromBase: (v) => v / 0.79 },
    jpy: { name: 'Japanese Yen', symbol: 'JPY', toBase: (v) => v / 150, fromBase: (v) => v * 150 },
    cad: { name: 'Canadian Dollar', symbol: 'CAD', toBase: (v) => v * 1.35, fromBase: (v) => v / 1.35 },
    aud: { name: 'Australian Dollar', symbol: 'AUD', toBase: (v) => v * 1.52, fromBase: (v) => v / 1.52 },
    inr: { name: 'Indian Rupee', symbol: 'INR', toBase: (v) => v / 83, fromBase: (v) => v * 83 },
    cny: { name: 'Chinese Yuan', symbol: 'CNY', toBase: (v) => v / 7.2, fromBase: (v) => v * 7.2 },
  },
};

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
  volume: 'Volume',
  time: 'Time',
  currency: 'Currency',
};
