# Travel Planning GraphQL API

## Step 1: Install Dependencies

**What we did:**
```bash
npm install graphql apollo-server-express express axios
npm install --save-dev @types/express @types/axios ts-node-dev
```

**Why:**
- `graphql` - Core library to build GraphQL APIs
- `apollo-server-express` - GraphQL server that handles requests
- `express` - Web server to run our API
- `axios` - Makes HTTP requests to OpenMeteo API
- `@types/express` & `@types/axios` - TypeScript type definitions
- `ts-node-dev` - Auto-restarts server when we save code changes

---

---

## Step 2: Create Server Entry Point

**File created:** `src/index.ts`

**What it does:**
- Creates an Express web server
- Sets up Apollo GraphQL server
- Connects GraphQL to Express
- Starts listening on port 4000

**Why we need it:**
This is the main file that starts our application. Without it, we have no running server.

**Key parts:**
- `ApolloServer` - Handles GraphQL requests
- `typeDefs` - Defines what data clients can request (schema)
- `resolvers` - Functions that fetch the actual data
- `server.applyMiddleware` - Connects GraphQL to Express
- `app.listen(4000)` - Starts server on port 4000

---

## Step 3: Create GraphQL Schema

**File created:** `src/schema/index.ts`

**What it does:**
Defines what data clients can request - like a menu at a restaurant.

**Why we need it:**
GraphQL requires a schema. It tells clients exactly what they can ask for and what they'll get back.

**What's in it:**

1. **City type** - Represents a city (name, latitude, longitude, country)
2. **Weather type** - Represents weather data (temperature, condition, wind, precipitation)
3. **Activity type** - Represents a ranked activity (name, score, reason)
4. **Query type** - The actual requests clients can make:
   - `searchCities(query)` - Find cities by name
   - `getWeather(lat, lon)` - Get weather for a location
   - `getActivities(lat, lon)` - Get ranked activities based on weather

**Important symbols:**
- `!` means required (cannot be null)
- `[City!]!` means array of cities, never null
- `Float` is a decimal number, `String` is text

---

## Step 4: Create Resolvers

**File created:** `src/resolvers/index.ts`

**What it does:**
Resolvers are functions that fetch the actual data when clients make queries.

**Why we need it:**
The schema says "you CAN request this data", but resolvers actually GO GET that data.

**How it works:**
Each resolver function matches a query in the schema:
- `searchCities(query)` → Calls service to search cities
- `getWeather(lat, lon)` → Calls service to get weather
- `getActivities(lat, lon)` → Calls service to rank activities

**Important:**
- `async/await` - Used because we're calling external APIs (takes time)
- `_` - First parameter (unused, it's the parent object)
- Second parameter - Contains the arguments passed in the query

---

## Step 5: Create OpenMeteo Service

**File created:** `src/services/openMeteoService.ts`

**What it does:**
Makes HTTP requests to OpenMeteo API and processes the data.

**Why we need it:**
This is where the actual work happens - getting real city and weather data from external APIs.

**Three main functions:**

1. **searchCities(query)**
   - Calls OpenMeteo Geocoding API
   - Searches for cities matching the query string
   - Returns array of cities (name, lat, lon, country)

2. **getWeatherForecast(lat, lon)**
   - Calls OpenMeteo Weather API
   - Gets current weather for location
   - Returns temperature, condition, wind speed, precipitation

3. **rankActivities(lat, lon)**
   - Gets weather data
   - Scores 4 activities based on weather conditions
   - Returns sorted array (best activity first)

**Activity scoring logic:**
- **Skiing** - Prefers cold temps (<0°C) and precipitation (snow)
- **Surfing** - Prefers warm temps (>20°C) and moderate wind
- **Indoor Sightseeing** - Better when it's raining or extreme temps
- **Outdoor Sightseeing** - Best with 15-25°C, no rain, light wind

**Why separate service file:**
- Keeps API logic separate from GraphQL logic
- Easy to test independently
- Easy to swap out APIs if needed

---

## Step 6: Add npm Scripts

**File modified:** `package.json`

**What we did:**
```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

**Why we need it:**
Makes it easy to run the server with simple commands.

**Commands explained:**
- `npm run dev` - Runs server in development mode
  - `--respawn` - Auto-restarts when files change
  - `--transpile-only` - Faster (skips type checking, we check separately)
  - Runs `src/index.ts` directly without compiling first

- `npm run build` - Compiles TypeScript to JavaScript
  - Uses `tsc` (TypeScript compiler)
  - Outputs to `dist/` folder (from tsconfig.json)

- `npm start` - Runs compiled JavaScript (for production)
  - Runs the compiled file from `dist/index.js`

---

## Step 7: Test the Server

**What we did:**
Started the development server with `npm run dev`

**Result:**
```
🚀 Server running at http://localhost:4000/graphql
```

**Why this works:**
- ts-node-dev compiles and runs TypeScript on the fly
- Server starts successfully
- GraphQL Playground is available at http://localhost:4000/graphql

**How to test:**
1. Open browser and go to http://localhost:4000/graphql
2. You'll see Apollo GraphQL Playground
3. Try example queries like:

```graphql
query {
  searchCities(query: "London") {
    name
    country
    latitude
    longitude
  }
}
```

**Server is now running and ready to use!**

---

## Step 8: Setup Jest for Testing

**What we did:**
```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

**Why:**
Testing ensures your API works correctly before the interview and catches bugs early.

**Packages installed:**
- `jest` - Testing framework that runs your tests
- `@types/jest` - TypeScript definitions for Jest (autocomplete)
- `ts-jest` - Allows Jest to understand TypeScript files
- `supertest` - Library for testing HTTP endpoints
- `@types/supertest` - TypeScript definitions for supertest

**File created:** `jest.config.js`

**What it does:**
Configures Jest to work with TypeScript:
- `preset: 'ts-jest'` - Use ts-jest to compile TypeScript
- `testEnvironment: 'node'` - Run tests in Node.js (not browser)
- `roots: ['<rootDir>/src']` - Look for tests in src folder
- `testMatch` - Find files ending in `.test.ts` or `.spec.ts`

**Test scripts added to package.json:**
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests and watch for changes
- `npm run test:coverage` - Run tests and show coverage report

---

## Step 9: Write Tests

**File created:** `src/services/openMeteoService.test.ts`

**What we did:**
Created tests for all three service functions to verify they work correctly.

**Tests created:**

1. **searchCities test**
   - Searches for "London"
   - Verifies it returns an array with results

2. **getWeatherForecast test**
   - Gets weather for London coordinates
   - Verifies response has: temperature, condition, windSpeed, precipitation
   - Verifies values are numbers (valid data)

3. **rankActivities tests** (2 tests)
   - Test 1: Verifies it returns array with name, score, and reason
   - Test 2: Verifies activities are sorted by score (best first)

**Why these tests:**
- Ensures API functions work before the interview
- Catches bugs early
- Shows you understand testing best practices

**Running the tests:**
```bash
npm test
```

**Expected output:**
```
Test Suites: 1 passed
Tests:       4 passed
```

---

## Next Steps

Your GraphQL API is complete! Here's what you have:
- ✅ City search functionality
- ✅ Weather forecasts
- ✅ Activity recommendations based on weather
- ✅ Clean architecture with services and resolvers
- ✅ TypeScript type safety
- ✅ Jest testing setup
- ✅ 4 passing tests covering all API functions

**To stop the server:** Press Ctrl+C in the terminal

