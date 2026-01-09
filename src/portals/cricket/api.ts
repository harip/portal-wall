import { CricketMatch, LiveMatch, MatchDetail, TEST_PLAYING_NATIONS } from './types';

// Using cricapi.com - Free tier
// Note: You'll need to sign up at https://www.cricapi.com/ and get your API key
const CRICKET_API_KEY = process.env.NEXT_PUBLIC_CRICKET_API_KEY || 'demo-key';
const BASE_URL = 'https://api.cricapi.com/v1';

// ESPN Cricinfo RSS Feed for real past matches
const ESPN_RSS_FEED = 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml';

// Fallback: If cricapi doesn't work, we can use unofficial CricBuzz API
// const CRICBUZZ_BASE = 'https://cricbuzz-cricket.p.rapidapi.com';

export async function getCurrentMatches(): Promise<LiveMatch[]> {
  try {
    const response = await fetch(`${BASE_URL}/currentMatches?apikey=${CRICKET_API_KEY}&offset=0`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cricket matches');
    }
    
    const data = await response.json();
    
    if (!data.data) {
      return [];
    }
    
    // Filter for international matches involving test-playing nations
    const testNationNames = TEST_PLAYING_NATIONS.map(t => t.name.toLowerCase());
    const testNationCodes = TEST_PLAYING_NATIONS.map(t => t.code.toLowerCase());
    
    const matches = data.data
      .filter((match: any) => {
        // Only international matches
        if (!match.matchType || match.matchType === 'Domestic') return false;
        
        // Check if teams are test-playing nations
        const teams = match.teams || [];
        const hasTestNation = teams.some((team: string) => 
          testNationNames.some(nation => team.toLowerCase().includes(nation)) ||
          testNationCodes.some(code => team.toLowerCase().includes(code))
        );
        
        return hasTestNation;
      })
      .map((match: any) => ({
        id: match.id,
        name: match.name,
        matchType: match.matchType,
        status: match.status,
        venue: match.venue || 'TBA',
        teams: match.teams || [],
        score: match.score || [],
        current: match.ms === 'result' ? 'Finished' : match.ms === 'live' ? 'Live' : 'Upcoming',
        date: match.date,
        dateTimeGMT: match.dateTimeGMT,
      }));
    
    return matches;
  } catch (error) {
    console.error('Error fetching cricket matches:', error);
    // Return mock data for development
    return getMockMatches();
  }
}

export async function getRecentMatches(): Promise<LiveMatch[]> {
  try {
    // First try to fetch from ESPN RSS feed for real data
    const rssMatches = await fetchFromESPNRSS();
    if (rssMatches.length > 0) {
      return rssMatches;
    }
    
    // Fallback: Get all current matches and filter for completed ones
    const allMatches = await getCurrentMatches();
    const recentMatches = allMatches.filter(match => match.current === 'Finished');
    
    // If no matches from API, return mock data
    if (recentMatches.length === 0) {
      return getMockPastMatches();
    }
    
    return recentMatches;
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    return getMockPastMatches();
  }
}

async function fetchFromESPNRSS(): Promise<LiveMatch[]> {
  try {
    const response = await fetch(ESPN_RSS_FEED, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch ESPN RSS feed');
      return [];
    }
    
    const xmlText = await response.text();
    const matches = parseESPNRSSFeed(xmlText);
    
    // Filter for test-playing nations
    const testNationNames = TEST_PLAYING_NATIONS.map(t => t.name.toLowerCase());
    const filteredMatches = matches.filter(match => {
      const teams = match.teams || [];
      return teams.some((team: string) => 
        testNationNames.some(nation => team.toLowerCase().includes(nation))
      );
    });
    
    return filteredMatches;
  } catch (error) {
    console.error('Error fetching from ESPN RSS:', error);
    return [];
  }
}

function parseESPNRSSFeed(xmlText: string): LiveMatch[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    const matches: LiveMatch[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      
      // Try to parse match information from title
      // ESPN titles are like "India beat Australia by 8 wickets" or "England vs Pakistan, 2nd ODI"
      const matchInfo = parseMatchTitle(title, description);
      
      if (matchInfo) {
        matches.push({
          id: `rss-${index}-${Date.now()}`,
          name: matchInfo.name,
          matchType: matchInfo.matchType,
          status: matchInfo.status,
          venue: matchInfo.venue || 'TBA',
          teams: matchInfo.teams,
          score: matchInfo.score || [],
          current: 'Finished',
          dateTimeGMT: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        });
      }
    });
    
    return matches;
  } catch (error) {
    console.error('Error parsing ESPN RSS feed:', error);
    return [];
  }
}

function parseMatchTitle(title: string, description: string): {
  name: string;
  matchType: 'Test' | 'ODI' | 'T20' | 'T20I';
  status: string;
  venue?: string;
  teams: string[];
  score?: any[];
} | null {
  try {
    // Detect match type
    let matchType: 'Test' | 'ODI' | 'T20' | 'T20I' = 'Test';
    if (title.includes('ODI') || description.includes('ODI')) {
      matchType = 'ODI';
    } else if (title.includes('T20I') || description.includes('T20I')) {
      matchType = 'T20I';
    } else if (title.includes('T20') || description.includes('T20')) {
      matchType = 'T20';
    } else if (title.includes('Test') || description.includes('Test')) {
      matchType = 'Test';
    }
    
    // Extract team names (look for test-playing nations)
    const foundTeams: string[] = [];
    TEST_PLAYING_NATIONS.forEach(nation => {
      if (title.toLowerCase().includes(nation.name.toLowerCase()) ||
          description.toLowerCase().includes(nation.name.toLowerCase())) {
        foundTeams.push(nation.name);
      }
    });
    
    // Need at least 2 teams
    if (foundTeams.length < 2) {
      return null;
    }
    
    // Extract match name and status
    let matchName = title;
    let status = title;
    
    // Common patterns: "Team1 beat Team2", "Team1 vs Team2"
    if (foundTeams.length >= 2) {
      matchName = `${foundTeams[0]} vs ${foundTeams[1]}, ${matchType}`;
    }
    
    return {
      name: matchName,
      matchType,
      status,
      teams: foundTeams,
      venue: undefined,
      score: [],
    };
  } catch (error) {
    return null;
  }
}

export async function getMatchDetails(matchId: string): Promise<MatchDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/match_info?apikey=${CRICKET_API_KEY}&id=${matchId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch match details');
    }
    
    const data = await response.json();
    
    if (!data.data) {
      return null;
    }
    
    const match = data.data;
    
    return {
      id: match.id,
      name: match.name,
      matchType: match.matchType,
      status: match.status,
      venue: match.venue || 'TBA',
      date: match.dateTimeGMT,
      teams: match.teams || [],
      score: match.score || [],
      tossWinner: match.tossWinner,
      tossChoice: match.tossChoice,
      matchWinner: match.matchWinner,
    };
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
}

// Generate external match URL (ESPNcricinfo)
export function getMatchUrl(matchId: string, matchName: string): string {
  // For real implementation, you would use the actual match ID from cricinfo
  // Format: https://www.espncricinfo.com/series/[series-id]/[match-id]/full-scorecard
  
  // For now, search ESPNcricinfo with match name
  const searchQuery = encodeURIComponent(matchName);
  return `https://www.espncricinfo.com/search?q=${searchQuery}`;
}

// Mock data for development/demo
function getMockMatches(): LiveMatch[] {
  return [
    {
      id: '1',
      name: 'India vs Australia, 1st Test',
      matchType: 'Test',
      status: 'India won by 8 wickets',
      venue: 'Melbourne Cricket Ground',
      teams: ['India', 'Australia'],
      score: [
        { team: 'Australia', runs: '195', wickets: '10', overs: '65.4', inning: '1st' },
        { team: 'India', runs: '326', wickets: '10', overs: '107.2', inning: '1st' },
        { team: 'Australia', runs: '234', wickets: '10', overs: '72.3', inning: '2nd' },
        { team: 'India', runs: '105', wickets: '2', overs: '28.1', inning: '2nd' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2024-12-26').toISOString(),
    },
    {
      id: '2',
      name: 'England vs Pakistan, 2nd ODI',
      matchType: 'ODI',
      status: 'England won by 52 runs',
      venue: 'Lords, London',
      teams: ['England', 'Pakistan'],
      score: [
        { team: 'England', runs: '334', wickets: '6', overs: '50.0' },
        { team: 'Pakistan', runs: '282', wickets: '10', overs: '47.3' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2024-12-29').toISOString(),
    },
    {
      id: '3',
      name: 'New Zealand vs South Africa, 1st T20I',
      matchType: 'T20I',
      status: 'Live - SA needs 45 runs in 24 balls',
      venue: 'Eden Park, Auckland',
      teams: ['New Zealand', 'South Africa'],
      score: [
        { team: 'New Zealand', runs: '186', wickets: '5', overs: '20.0' },
        { team: 'South Africa', runs: '142', wickets: '4', overs: '16.0' },
      ],
      current: 'Live',
      dateTimeGMT: new Date().toISOString(),
    },
  ];
}

function getMockPastMatches(): LiveMatch[] {
  return [
    {
      id: '101',
      name: 'India vs England, 4th Test',
      matchType: 'Test',
      status: 'India won by 157 runs',
      venue: 'Narendra Modi Stadium, Ahmedabad',
      teams: ['India', 'England'],
      score: [
        { team: 'India', runs: '365', wickets: '10', overs: '114.4', inning: '1st' },
        { team: 'England', runs: '205', wickets: '10', overs: '75.5', inning: '1st' },
        { team: 'India', runs: '186', wickets: '10', overs: '58.1', inning: '2nd' },
        { team: 'England', runs: '189', wickets: '10', overs: '81.5', inning: '2nd' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2025-01-08').toISOString(),
    },
    {
      id: '102',
      name: 'Australia vs Pakistan, 3rd ODI',
      matchType: 'ODI',
      status: 'Australia won by 6 wickets',
      venue: 'Perth Stadium',
      teams: ['Australia', 'Pakistan'],
      score: [
        { team: 'Pakistan', runs: '268', wickets: '9', overs: '50.0' },
        { team: 'Australia', runs: '271', wickets: '4', overs: '47.3' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2025-01-06').toISOString(),
    },
    {
      id: '103',
      name: 'South Africa vs West Indies, 2nd Test',
      matchType: 'Test',
      status: 'South Africa won by an innings and 15 runs',
      venue: 'The Wanderers, Johannesburg',
      teams: ['South Africa', 'West Indies'],
      score: [
        { team: 'West Indies', runs: '189', wickets: '10', overs: '62.3', inning: '1st' },
        { team: 'South Africa', runs: '453', wickets: '10', overs: '129.4', inning: '1st' },
        { team: 'West Indies', runs: '249', wickets: '10', overs: '89.2', inning: '2nd' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2025-01-04').toISOString(),
    },
    {
      id: '104',
      name: 'New Zealand vs Bangladesh, 1st T20I',
      matchType: 'T20I',
      status: 'New Zealand won by 8 runs',
      venue: 'Bay Oval, Mount Maunganui',
      teams: ['New Zealand', 'Bangladesh'],
      score: [
        { team: 'New Zealand', runs: '167', wickets: '7', overs: '20.0' },
        { team: 'Bangladesh', runs: '159', wickets: '8', overs: '20.0' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2025-01-02').toISOString(),
    },
    {
      id: '105',
      name: 'England vs Sri Lanka, 2nd Test',
      matchType: 'Test',
      status: 'England won by 5 wickets',
      venue: 'Lords, London',
      teams: ['England', 'Sri Lanka'],
      score: [
        { team: 'Sri Lanka', runs: '192', wickets: '10', overs: '53.1', inning: '1st' },
        { team: 'England', runs: '325', wickets: '10', overs: '82.5', inning: '1st' },
        { team: 'Sri Lanka', runs: '216', wickets: '10', overs: '63.3', inning: '2nd' },
        { team: 'England', runs: '87', wickets: '5', overs: '21.4', inning: '2nd' },
      ],
      current: 'Finished',
      dateTimeGMT: new Date('2024-12-30').toISOString(),
    },
  ];
}

export function getTeamFlag(teamName: string): string {
  const team = TEST_PLAYING_NATIONS.find(t => 
    teamName.toLowerCase().includes(t.name.toLowerCase()) || 
    teamName.toLowerCase().includes(t.code.toLowerCase())
  );
  return team ? team.flag : '🏏';
}

export function formatMatchDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
