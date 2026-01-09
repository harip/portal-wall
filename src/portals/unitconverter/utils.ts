import { UnitType, UNIT_DEFINITIONS } from './types';

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  unitType: UnitType
): number {
  const definitions = UNIT_DEFINITIONS[unitType];
  const fromDef = definitions[fromUnit];
  const toDef = definitions[toUnit];

  if (!fromDef || !toDef) return value;

  // Convert to base unit, then to target unit
  const baseValue = fromDef.toBase(value);
  return toDef.fromBase(baseValue);
}

export function formatNumber(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) < 0.0001) return value.toExponential(2);
  if (Math.abs(value) > 1000000) return value.toExponential(2);
  return value.toLocaleString('en-US', { maximumFractionDigits: 6 });
}
