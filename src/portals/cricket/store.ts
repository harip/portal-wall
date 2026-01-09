import { create } from 'zustand';
import { LiveMatch, MatchDetail } from './types';
import { getCurrentMatches, getMatchDetails, getRecentMatches } from './api';

interface CricketStore {
  matches: LiveMatch[];
  pastMatches: LiveMatch[];
  selectedMatch: MatchDetail | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  hydrated: boolean;
  
  setHydrated: () => void;
  fetchMatches: () => Promise<void>;
  fetchPastMatches: () => Promise<void>;
  fetchMatchDetails: (matchId: string) => Promise<void>;
  refreshMatches: () => Promise<void>;
}

export const useCricketStore = create<CricketStore>((set, get) => ({
  matches: [],
  pastMatches: [],
  selectedMatch: null,
  loading: false,
  error: null,
  lastUpdated: null,
  hydrated: false,

  setHydrated: () => {
    set({ hydrated: true });
    get().fetchMatches();
    get().fetchPastMatches();
  },
  
  fetchMatches: async () => {
    set({ loading: true, error: null });
    
    try {
      const matches = await getCurrentMatches();
      set({
        matches,
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error fetching cricket matches:', error);
      set({ 
        error: 'Failed to fetch cricket matches',
        loading: false 
      });
    }
  },

  fetchPastMatches: async () => {
    try {
      const pastMatches = await getRecentMatches();
      set({ pastMatches });
    } catch (error) {
      console.error('Error fetching past matches:', error);
    }
  },

  fetchMatchDetails: async (matchId: string) => {
    set({ loading: true, error: null });
    
    try {
      const matchDetails = await getMatchDetails(matchId);
      set({
        selectedMatch: matchDetails,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching match details:', error);
      set({ 
        error: 'Failed to fetch match details',
        loading: false 
      });
    }
  },

  refreshMatches: async () => {
    await get().fetchMatches();
    await get().fetchPastMatches();
  },
}));
