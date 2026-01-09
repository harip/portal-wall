'use client';

import React, { useState } from 'react';
import { Key, Copy, RefreshCw, Check } from 'lucide-react';
import { PasswordOptions, DEFAULT_OPTIONS, PasswordStrength } from './types';
import { generatePassword, calculateStrength, getStrengthColor, getStrengthLabel } from './utils';

export default function PasswordGeneratorApp() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState<string>('');
  const [strength, setStrength] = useState<PasswordStrength>('medium');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setStrength(calculateStrength(newPassword, options));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    if (password) {
      setStrength(calculateStrength(password, newOptions));
    }
  };

  // Generate on mount
  React.useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Generated Password Display */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">Generated Password</label>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm break-all">
            {password || 'Click Generate'}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2"
            disabled={!password}
            aria-label="Copy password"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <button
            onClick={handleGenerate}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors flex items-center gap-2"
            aria-label="Generate new password"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Strength Indicator */}
      {password && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Strength</span>
            <span className={`text-xs font-medium ${getStrengthColor(strength)}`}>
              {getStrengthLabel(strength)}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                strength === 'weak' ? 'bg-red-500 w-1/4' :
                strength === 'medium' ? 'bg-yellow-500 w-1/2' :
                strength === 'strong' ? 'bg-green-500 w-3/4' :
                'bg-emerald-500 w-full'
              }`}
            />
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 flex-1 overflow-auto">
        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white/90">Length</label>
            <span className="text-sm text-white/60">{options.length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={options.length}
            onChange={(e) => updateOption('length', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Sets */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Character Sets</label>
          
          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => updateOption('includeUppercase', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-white/90">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => updateOption('includeLowercase', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-white/90">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => updateOption('includeNumbers', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-white/90">Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => updateOption('includeSymbols', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-white/90">Symbols (!@#$%...)</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-white/90">Exclude Similar (0, O, l, 1)</span>
          </label>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
}
