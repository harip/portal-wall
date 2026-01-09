'use client';

import React from 'react';
import { useCricketStore } from '../store';
import { RefreshCw, Trophy } from 'lucide-react';
import { getTeamFlag } from '../api';

export default function LiveMatches() {
  const { matches, loading, lastUpdated, refreshMatches } = useCricketStore();

  const handleRefresh = () => {
    refreshMatches();
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/90 font-semibold">Live & Recent Matches</h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          aria-label="Refresh matches"
        >
          <RefreshCw 
            size={16} 
            className={`text-white/70 ${loading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <div className="text-xs text-white/40 mb-4">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Matches list */}
      <div className="space-y-3">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Trophy size={32} className="mx-auto mb-2 opacity-40" />
            <p>No matches available</p>
            <p className="text-xs mt-1">Check back later for updates</p>
          </div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
            >
              {/* Match header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white/90 mb-1">
                    {match.name}
                  </div>
                  <div className="text-xs text-white/60">
                    {match.matchType} • {match.venue}
                  </div>
                </div>
                {match.current === 'Live' && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Teams and scores */}
              <div className="space-y-2 mt-3">
                {match.score.length > 0 ? (
                  match.score.map((score, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTeamFlag(score.team)}</span>
                        <span className="text-sm text-white/80">{score.team}</span>
                      </div>
                      <div className="text-sm font-mono">
                        <span className="text-white font-semibold">{score.runs}/{score.wickets}</span>
                        <span className="text-white/60 ml-2">({score.overs})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  match.teams.map((team, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-lg">{getTeamFlag(team)}</span>
                      <span className="text-sm text-white/80">{team}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Status */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-white/70">{match.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
