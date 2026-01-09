'use client';

import React, { useMemo } from 'react';
import { useCricketStore } from '../store';
import { Trophy, ExternalLink, Calendar } from 'lucide-react';
import { getTeamFlag, getMatchUrl, formatMatchDate } from '../api';

export default function PastMatches() {
  const { pastMatches, loading } = useCricketStore();

  // Sort matches by date, latest first
  const sortedMatches = useMemo(() => {
    return [...pastMatches].sort((a, b) => {
      const dateA = a.dateTimeGMT ? new Date(a.dateTimeGMT).getTime() : 0;
      const dateB = b.dateTimeGMT ? new Date(b.dateTimeGMT).getTime() : 0;
      return dateB - dateA; // Latest first
    });
  }, [pastMatches]);

  const handleMatchClick = (matchId: string, matchName: string) => {
    const url = getMatchUrl(matchId, matchName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  if (loading && sortedMatches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Loading past matches...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/90 font-semibold">Recent Results</h3>
        <div className="text-xs text-white/50">
          Sorted by latest
        </div>
      </div>

      {/* Matches list */}
      <div className="space-y-3">
        {sortedMatches.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Trophy size={32} className="mx-auto mb-2 opacity-40" />
            <p>No past matches available</p>
            <p className="text-xs mt-1">Recent match results will appear here</p>
          </div>
        ) : (
          sortedMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => handleMatchClick(match.id, match.name)}
              className="w-full bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-left group"
            >
              {/* Match header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white/90 mb-1 group-hover:text-white transition-colors">
                    {match.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span>{match.matchType}</span>
                    <span>•</span>
                    <span>{match.venue}</span>
                  </div>
                  {match.dateTimeGMT && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-white/50">
                      <Calendar size={12} />
                      <span>{formatDate(match.dateTimeGMT)}</span>
                    </div>
                  )}
                </div>
                <ExternalLink 
                  size={16} 
                  className="text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0 ml-2" 
                />
              </div>

              {/* Teams and scores */}
              <div className="space-y-2 mt-3">
                {match.score.length > 0 ? (
                  match.score.slice(0, 4).map((score, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTeamFlag(score.team)}</span>
                        <div className="flex flex-col">
                          <span className="text-sm text-white/80">{score.team}</span>
                          {score.inning && (
                            <span className="text-xs text-white/40">{score.inning} innings</span>
                          )}
                        </div>
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

              {/* Result */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-green-400">
                    {match.status}
                  </div>
                  <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                    Click for details →
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Info note */}
      {sortedMatches.length > 0 && (
        <div className="mt-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-xs text-blue-300">
            Click on any match to view full details on ESPNcricinfo
          </div>
        </div>
      )}
    </div>
  );
}
