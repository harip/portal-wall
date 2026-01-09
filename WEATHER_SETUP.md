# 🌤️ Weather Portal Setup

## Getting Started

### 1. Get a Free OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" (free tier available)
3. Verify your email
4. Go to "API keys" in your account
5. Copy your API key

### 2. Add API Key to Project

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

**Note:** Never commit your `.env.local` file to git!

### 3. Restart the Development Server

```bash
npm run dev
```

## Features

✅ Real-time weather data
✅ Search and add multiple locations worldwide
✅ Hourly and weekly forecasts
✅ Temperature unit toggle (F/C)
✅ Locations saved to localStorage
✅ Active location indicator
✅ Clean, modern UI

## Usage

1. **Add Location:** Click the + button in the Locations tab
2. **Search:** Type a city name (e.g., "New York", "London")
3. **Select:** Click on a search result to add it
4. **Switch:** Click on any saved location to see its weather
5. **Remove:** Click the trash icon to remove a location

All your locations are automatically saved!


https://api.openweathermap.org/data/2.5/weather?lat=undefined&lon=undefined&units=imperial&appid=9d8c89e9ce2dd8757c60df082b5a08b5