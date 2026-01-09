'use client';

import React, { useState, useEffect } from 'react';
import { useUnitConverterStore } from './store';
import { UnitType, UNIT_DEFINITIONS, UNIT_TYPE_LABELS } from './types';
import { convertUnit, formatNumber } from './utils';

export default function UnitConverterApp() {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('kilometer');
  const { setHydrated, hydrated } = useUnitConverterStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  useEffect(() => {
    // Reset units when type changes
    const units = Object.keys(UNIT_DEFINITIONS[unitType]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [unitType]);

  const handleSwap = () => {
    const tempUnit = fromUnit;
    const convertedValue = convertUnit(parseFloat(fromValue) || 0, fromUnit, toUnit, unitType);
    setFromValue(formatNumber(convertedValue).toString());
    setFromUnit(toUnit);
    setToUnit(tempUnit);
  };

  const units = Object.entries(UNIT_DEFINITIONS[unitType]);

  return (
    <div className="p-4 space-y-4">
      {/* Unit Type Selector */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Unit Type</label>
        <select
          value={unitType}
          onChange={(e) => setUnitType(e.target.value as UnitType)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
        >
          {Object.entries(UNIT_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key} className="bg-slate-900">{label}</option>
          ))}
        </select>
      </div>

      {/* From Unit */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">From</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm"
            placeholder="Enter value"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
          >
            {units.map(([key, def]) => (
              <option key={key} value={key} className="bg-slate-900">{def.symbol} - {def.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSwap}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Swap units"
        >
          ⇅
        </button>
      </div>

      {/* To Unit */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">To</label>
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
            {formatNumber(convertUnit(parseFloat(fromValue) || 0, fromUnit, toUnit, unitType))}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
          >
            {units.map(([key, def]) => (
              <option key={key} value={key} className="bg-slate-900">{def.symbol} - {def.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
