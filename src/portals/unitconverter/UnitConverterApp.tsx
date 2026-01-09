'use client';

import React, { useState, useEffect } from 'react';
import { Ruler, History, Star } from 'lucide-react';
import { useUnitConverterStore } from './store';
import { UnitType, UNIT_DEFINITIONS, UNIT_TYPE_LABELS } from './types';
import { convertUnit, formatNumber } from './utils';

type TabType = 'converter' | 'history' | 'favorites';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'converter', label: 'Converter', icon: <Ruler size={14} /> },
  { id: 'history', label: 'History', icon: <History size={14} /> },
  { id: 'favorites', label: 'Favorites', icon: <Star size={14} /> },
];

export default function UnitConverterApp() {
  const [activeTab, setActiveTab] = useState<TabType>('converter');
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('kilometer');
  const { setHydrated, hydrated, addConversion, conversions, deleteConversion, clearHistory, favorites, toggleFavorite } = useUnitConverterStore();

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

  const handleConvert = () => {
    const numValue = parseFloat(fromValue);
    if (isNaN(numValue)) return;

    const converted = convertUnit(numValue, fromUnit, toUnit, unitType);
    const toValue = converted;

    addConversion({
      fromValue: numValue,
      fromUnit,
      toValue,
      toUnit,
      unitType,
    });
  };

  const handleSwap = () => {
    const tempValue = fromValue;
    const tempUnit = fromUnit;
    setFromValue(formatNumber(convertUnit(parseFloat(fromValue) || 0, fromUnit, toUnit, unitType)).toString());
    setFromUnit(toUnit);
    setToUnit(tempUnit);
  };

  const units = Object.entries(UNIT_DEFINITIONS[unitType]);

  const renderConverter = () => (
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
            onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
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

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
      >
        Save to History
      </button>
    </div>
  );

  const renderHistory = () => {
    const sortedConversions = [...conversions].sort((a, b) => b.createdAt - a.createdAt);

    if (sortedConversions.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <p className="text-white/60 mb-2">No conversion history</p>
          <p className="text-white/40 text-sm">Convert units to see history</p>
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-white/90">Recent Conversions</h3>
          <button
            onClick={clearHistory}
            className="text-xs text-white/60 hover:text-white/90 transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-2">
          {sortedConversions.map((conv) => {
            const fromDef = UNIT_DEFINITIONS[conv.unitType][conv.fromUnit];
            const toDef = UNIT_DEFINITIONS[conv.unitType][conv.toUnit];
            const favoriteKey = `${conv.unitType}-${conv.fromUnit}-${conv.toUnit}`;
            const isFavorite = favorites.includes(favoriteKey);

            return (
              <div
                key={conv.id}
                className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-sm text-white">
                    {formatNumber(conv.fromValue)} {fromDef.symbol} = {formatNumber(conv.toValue)} {toDef.symbol}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {UNIT_TYPE_LABELS[conv.unitType]}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(favoriteKey)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFavorite
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => deleteConversion(conv.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                    aria-label="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFavorites = () => {
    if (favorites.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <Star size={48} className="text-white/30 mb-4" />
          <p className="text-white/60 mb-2">No favorites yet</p>
          <p className="text-white/40 text-sm">Star conversions to add them here</p>
        </div>
      );
    }

    const favoriteConversions = conversions.filter(conv => {
      const favoriteKey = `${conv.unitType}-${conv.fromUnit}-${conv.toUnit}`;
      return favorites.includes(favoriteKey);
    });

    return (
      <div className="h-full overflow-auto p-4">
        <div className="space-y-2">
          {favoriteConversions.map((conv) => {
            const fromDef = UNIT_DEFINITIONS[conv.unitType][conv.fromUnit];
            const toDef = UNIT_DEFINITIONS[conv.unitType][conv.toUnit];
            const favoriteKey = `${conv.unitType}-${conv.fromUnit}-${conv.toUnit}`;

            return (
              <div
                key={conv.id}
                className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-sm text-white">
                    {formatNumber(conv.fromValue)} {fromDef.symbol} = {formatNumber(conv.toValue)} {toDef.symbol}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {UNIT_TYPE_LABELS[conv.unitType]}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUnitType(conv.unitType);
                    setFromUnit(conv.fromUnit);
                    setToUnit(conv.toUnit);
                    setFromValue(conv.fromValue.toString());
                    setActiveTab('converter');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs transition-colors"
                >
                  Use
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/90 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'converter' && renderConverter()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'favorites' && renderFavorites()}
      </div>
    </div>
  );
}
