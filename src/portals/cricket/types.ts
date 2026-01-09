export interface CricketMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  score: MatchScore[];
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
  seriesName?: string;
}

export interface MatchScore {
  team: string;
  runs: string;
  wickets: string;
  overs: string;
  inning?: string;
}

export interface TeamInfo {
  name: string;
  code: string;
  flag: string;
}

export interface LiveMatch {
  id: string;
  name: string;
  matchType: 'Test' | 'ODI' | 'T20' | 'T20I';
  status: string;
  venue: string;
  teams: string[];
  score: MatchScore[];
  current: string;
  date?: string;
  dateTimeGMT?: string;
}

export interface MatchDetail {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  score: MatchScore[];
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
  currentInning?: string;
  target?: string;
}

// Test playing nations
export const TEST_PLAYING_NATIONS: TeamInfo[] = [
  { name: 'India', code: 'IND', flag: '🇮🇳' },
  { name: 'Australia', code: 'AUS', flag: '🇦🇺' },
  { name: 'England', code: 'ENG', flag: '🏴󐁧󐁢󐁥󐁮󐁧󐁿' },
  { name: 'Pakistan', code: 'PAK', flag: '🇵🇰' },
  { name: 'South Africa', code: 'RSA', flag: '🇿🇦' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'Sri Lanka', code: 'SL', flag: '🇱🇰' },
  { name: 'West Indies', code: 'WI', flag: '🏴' },
  { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩' },
  { name: 'Afghanistan', code: 'AFG', flag: '🇦🇫' },
  { name: 'Zimbabwe', code: 'ZIM', flag: '🇿🇼' },
  { name: 'Ireland', code: 'IRE', flag: '🇮🇪' },
];
