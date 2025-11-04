# Frontend Setup Guide

## Prerequisites

Before starting the frontend implementation, ensure you have completed:
1. **README.md** - Backend setup and GraphQL API implementation
2. **TECHNICAL_DECISIONS.md** - Understanding of the architecture and API design

The backend must be running and accessible for the frontend to work.

---

## Step 1: Install Apollo Client for GraphQL

**What we're doing:**
Installing GraphQL client libraries for React

**Command:**
```bash
npm install @apollo/client graphql
```

**Why:**
- `@apollo/client` - GraphQL client for React with caching and state management
- `graphql` - Peer dependency required by Apollo Client

**What it does:**
- Handles GraphQL queries to our backend
- Provides React hooks for data fetching
- Manages caching automatically
- Handles loading and error states

---

## Step 2: Create Apollo Client Provider

**What we're doing:**
Setting up Apollo Client to connect to our GraphQL backend

**Files created:**
- `lib/apollo-client.tsx`

**Code:**
```typescript
'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

**Files modified:**
- `app/layout.tsx` - Added `ApolloWrapper` import and wrapped children

**What it does:**
- Creates Apollo Client instance pointing to backend (port 4000)
- Configures in-memory cache for GraphQL responses
- Exports wrapper component to provide GraphQL to entire app

**Why we need it:**
- Centralizes GraphQL configuration in one place
- Makes `useQuery` and `useMutation` hooks available in all components
- Handles connection to backend API

---

## Step 3: Create GraphQL Query Definitions

**What we're doing:**
Defining all GraphQL queries that the frontend will use to fetch data from backend

**Files created:**
- `lib/queries.ts`

**Code:**
```typescript
import { gql } from '@apollo/client';

export const SEARCH_CITIES = gql`
  query SearchCities($query: String!) {
    searchCities(query: $query) {
      name
      latitude
      longitude
      country
    }
  }
`;

export const GET_WEATHER = gql`
  query GetWeather($latitude: Float!, $longitude: Float!) {
    getWeather(latitude: $latitude, longitude: $longitude) {
      temperature
      condition
      windSpeed
      precipitation
    }
  }
`;

export const GET_7_DAY_FORECAST = gql`
  query Get7DayForecast($latitude: Float!, $longitude: Float!) {
    get7DayForecast(latitude: $latitude, longitude: $longitude) {
      date
      temperatureMax
      temperatureMin
      windSpeed
      precipitation
      condition
    }
  }
`;

export const GET_ACTIVITIES = gql`
  query GetActivities($latitude: Float!, $longitude: Float!) {
    getActivities(latitude: $latitude, longitude: $longitude) {
      name
      score
      reason
    }
  }
`;
```

**What it does:**
- Defines 4 GraphQL queries matching our backend schema
- Each query specifies exactly what data fields to fetch
- Queries are reusable across components

**The 4 queries:**
1. `SEARCH_CITIES` - Search cities by name, returns city info with coordinates
2. `GET_WEATHER` - Get current weather for lat/lon coordinates
3. `GET_7_DAY_FORECAST` - Get 7 days of forecast data
4. `GET_ACTIVITIES` - Get ranked activities with scores and reasons

**Why separate file:**
- Keeps queries organized in one place
- Easy to reuse in multiple components
- Type-safe and easy to maintain

---

## Step 4: Create City Search Component

**What we're doing:**
Building an input field with live city search results (autocomplete dropdown)

**Files created:**
- `components/city-search.tsx`

**What it does:**
- User types city name in input field
- Searches cities as user types (with 300ms delay to avoid too many API calls)
- Shows dropdown with matching cities (name + country)
- User clicks a city to select it
- Emits selected city data (with lat/lon) to parent component

**Key features:**
- Debounced search (waits 300ms after user stops typing)
- Loading spinner while searching
- Error handling for failed searches
- Empty state when no results found
- Clean dropdown UI with hover effects

**Imports needed:**
```typescript
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_CITIES } from '@/lib/queries';
```

**Why each import:**
- `'use client'` - Next.js directive (component uses React hooks, needs client-side rendering)
- `useState` - React hook to manage input value and dropdown visibility
- `useEffect` - React hook to implement debouncing (delay search until user stops typing)
- `useMemo` - React hook to memoize cities array and prevent unnecessary re-renders
- `useQuery` - Apollo Client hook to execute GraphQL queries (from @apollo/client/react in v4)
- `SEARCH_CITIES` - The GraphQL query we defined in Step 3

**Component receives:**
- `onSelectCity` callback function - called when user selects a city

**Component logic:**
1. User types in input → update state
2. useEffect waits 300ms after last keystroke
3. If input has 2+ characters → run GraphQL query
4. Display results in dropdown
5. User clicks city → call onSelectCity callback with city data

---

## Step 5: Create Weather Display Component

**What we're doing:**
Building a component to display current weather conditions for selected city

**Files created:**
- `components/weather-display.tsx`

**What it does:**
- Receives latitude and longitude from parent
- Fetches current weather data using GraphQL
- Displays temperature, condition, wind speed, precipitation
- Shows loading state while fetching
- Handles errors gracefully

**Imports needed:**
```typescript
'use client';
import { useQuery } from '@apollo/client/react';
import { GET_WEATHER } from '@/lib/queries';
```

**Why each import:**
- `'use client'` - Next.js directive (uses React hooks)
- `useQuery` - Apollo Client hook to fetch weather data (from @apollo/client/react in v4)
- `GET_WEATHER` - GraphQL query from Step 3

**Component receives:**
- `latitude: number` - City latitude coordinate
- `longitude: number` - City longitude coordinate

**Component displays:**
- Large temperature value (e.g., "14.6°C")
- Weather condition badge (Sunny/Rainy)
- Wind speed with km/h unit
- Precipitation amount in mm

**UI Design:**
- Card layout with rounded corners and shadow
- Icons/emojis for visual appeal (optional)
- Color-coded condition badge (yellow for sunny, blue for rainy)
- Grid layout for weather details

---

## Step 6: Create 7-Day Forecast Component

**What we're doing:**
Building a component to display 7-day weather forecast in card format

**Files created:**
- `components/forecast-display.tsx`

**What it does:**
- Receives latitude and longitude from parent
- Fetches 7-day forecast data using GraphQL
- Displays each day in a card with date, temps, condition, precipitation
- Shows loading state while fetching
- Handles errors gracefully

**Imports needed:**
```typescript
'use client';
import { useQuery } from '@apollo/client/react';
import { GET_7_DAY_FORECAST } from '@/lib/queries';
```

**Why each import:**
- `'use client'` - Next.js directive (uses React hooks)
- `useQuery` - Apollo Client hook to fetch forecast data (from @apollo/client/react in v4)
- `GET_7_DAY_FORECAST` - GraphQL query from Step 3

**Component receives:**
- `latitude: number` - City latitude coordinate
- `longitude: number` - City longitude coordinate

**Component displays (per day):**
- Date (formatted as day of week)
- Temperature range (min - max)
- Weather condition badge
- Precipitation amount

**UI Design:**
- Horizontal scrollable container
- 7 cards side by side
- Each card: date, temp range, condition badge, precipitation
- Color-coded by condition (yellow for sunny, blue for rainy)
- Responsive: scroll on mobile, grid on desktop

---

## Step 7: Create Activity Rankings Component

**What we're doing:**
Building a component to display ranked activities based on weather conditions

**Files created:**
- `components/activities-display.tsx`

**What it does:**
- Receives latitude and longitude from parent
- Fetches activity rankings using GraphQL
- Displays 4 activities sorted by score (highest first)
- Shows score, activity name, and reason for each
- Shows loading state while fetching
- Handles errors gracefully

**Imports needed:**
```typescript
'use client';
import { useQuery } from '@apollo/client/react';
import { GET_ACTIVITIES } from '@/lib/queries';
```

**Why each import:**
- `'use client'` - Next.js directive (uses React hooks)
- `useQuery` - Apollo Client hook to fetch activities (from @apollo/client/react in v4)
- `GET_ACTIVITIES` - GraphQL query from Step 3

**Component receives:**
- `latitude: number` - City latitude coordinate
- `longitude: number` - City longitude coordinate

**Component displays (per activity):**
- Activity name (Skiing, Surfing, Indoor/Outdoor Sightseeing)
- Score (0-100) with progress bar
- Reason explaining the score

**UI Design:**
- List layout with 4 activity cards
- Progress bar showing score visually
- Score number displayed
- Reason text below activity name
- Cards sorted by score (best activity first)
- Color gradient for progress bar (green for high scores, yellow for medium, red for low)

---

## Step 8: Build Main Page with All Components

**What we're doing:**
Creating the main page that combines all components and manages state

**Files modified:**
- `app/page.tsx`

**What it does:**
- Displays city search at the top
- When user selects a city, stores city data (name, lat, lon) in state
- Passes coordinates to all data components
- Shows weather, forecast, and activities when city is selected
- Shows empty state when no city selected

**Imports needed:**
```typescript
'use client';
import { useState } from 'react';
import { CitySearch } from '@/components/city-search';
import { WeatherDisplay } from '@/components/weather-display';
import { ForecastDisplay } from '@/components/forecast-display';
import { ActivitiesDisplay } from '@/components/activities-display';
```

**Why each import:**
- `'use client'` - Next.js directive (uses React state)
- `useState` - React hook to manage selected city state
- All component imports - The components we created in Steps 4-7

**Component state:**
- `selectedCity` - Stores selected city with name, latitude, longitude

**Layout structure:**
```
Container
├─ City Search (always visible)
└─ If city selected:
   ├─ Weather Display
   ├─ 7-Day Forecast
   └─ Activity Rankings
```

---

## Step 9: Test Frontend with Backend API

**What we're doing:**
Starting both backend and frontend servers and testing the full application

**Commands needed:**

**Terminal 1 - Start Backend:**
```bash
npm run dev
```
This starts the GraphQL API on http://localhost:4000

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
This starts Next.js on http://localhost:3000

**Testing checklist:**
1. Open http://localhost:3000 in browser
2. Type "London" in search box
3. Wait for dropdown to appear (300ms debounce)
4. Click "London, United Kingdom"
5. Verify all data loads:
   - Current weather displays (temp, condition, wind, precipitation)
   - 7-day forecast shows 7 cards with dates and temps
   - Activity rankings show 4 activities with scores and reasons
6. Test dark mode toggle (top right)
7. Search for different cities (New York, Tokyo, Sydney)
8. Check browser console for any errors

**Expected behavior:**
- City search debounces after 300ms
- Loading spinners show while fetching
- All data displays correctly
- No console errors
- Dark mode works
- Responsive on mobile and desktop

---
