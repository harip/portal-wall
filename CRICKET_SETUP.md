# Cricket Portal Setup

The Cricket portal shows live scores and updates for international cricket matches involving test-playing nations.

## Data Sources

### Option 1: ESPN Cricinfo RSS Feed (Free & Active by Default) ✅

The portal automatically fetches **real match data** from ESPN Cricinfo's RSS feed:
- URL: https://www.espncricinfo.com/rss/content/story/feeds/0.xml
- **No API key required**
- **Free unlimited access**
- Updates automatically
- Shows recent match results

**This is enabled by default!** The portal will show real cricket news and match results from ESPN.

### Option 2: CricAPI (Optional - For Live Scores)

For more detailed live scores and match info:

1. Sign up at [https://www.cricapi.com/](https://www.cricapi.com/)
2. Get your free API key from the dashboard
3. Add it to your `.env.local` file:

```bash
NEXT_PUBLIC_CRICKET_API_KEY=your_api_key_here
```

**Free Tier Limits:**
- 100 requests per day
- Access to live scores, match details, and player stats

### Option 3: Demo Mode

If both RSS and API fail, the portal shows mock data with sample matches for testing.

## Features

### Live Matches Tab
- **Live scores** for ongoing matches (via CricAPI if configured)
- **Match details** including:
  - Score by innings
  - Overs bowled
  - Venue information
  - Match status

### Past Matches Tab ⭐ NEW
- **Real match results** from ESPN Cricinfo RSS feed
- **Automatic updates** from ESPN's news feed
- **Sorted by date** (latest first)
- **Clickable matches** - opens full scorecard on ESPN Cricinfo
- **Team flags** and match details
- **No API key required** - works out of the box!

### Teams Tab
- All 12 test-playing nations
- Country flags
- Team codes

## Filtering

The portal automatically filters to show only:
- **International matches** (Test, ODI, T20I)
- **Major teams** (12 test-playing nations only)
- Excludes domestic leagues and minor tournaments

## Test Playing Nations Included

1. 🇮🇳 India (IND)
2. 🇦🇺 Australia (AUS)
3. 🏴󐁧󐁢󐁥󐁮󐁧󐁿 England (ENG)
4. 🇵🇰 Pakistan (PAK)
5. 🇿🇦 South Africa (RSA)
6. 🇳🇿 New Zealand (NZ)
7. 🇱🇰 Sri Lanka (SL)
8. 🏴 West Indies (WI)
9. 🇧🇩 Bangladesh (BAN)
10. 🇦🇫 Afghanistan (AFG)
11. 🇿🇼 Zimbabwe (ZIM)
12. 🇮🇪 Ireland (IRE)

## Refresh Behavior

- Matches auto-load when portal opens
- Manual refresh button available
- Shows last updated timestamp

## Development Notes

The API implementation is in `/src/portals/cricket/api.ts` and includes:
- **ESPN RSS feed parser** for real match data (no auth required)
- CricAPI integration for live scores (optional)
- Mock data fallback for development
- Error handling
- Team filtering logic
- Date formatting utilities

## How It Works

1. **Past Matches**: Automatically fetches from ESPN RSS feed
2. **Live Matches**: Uses CricAPI if configured, otherwise shows mock data
3. **Fallback**: If both fail, displays sample data

Enjoy following your favorite cricket matches! 🏏
