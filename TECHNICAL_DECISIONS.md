# Technical Decisions & Architecture

## Architecture Overview

### Technical Choices

**GraphQL with Apollo Server**
- Chose GraphQL over REST for flexible querying - clients can request exactly what they need
- Apollo Server v4 provides robust error handling, type safety, and industry-standard tooling
- Express.js integration allows for easy extension with additional middleware if needed

**TypeScript**
- Strict type checking catches errors at compile time
- Interfaces for API responses ensure data consistency
- Better IDE support and refactoring capabilities
- Industry standard for production Node.js applications

**Service Layer Pattern**
- Separated OpenMeteo API logic into dedicated service file
- Resolvers remain thin - they only handle GraphQL concerns
- Services are easily testable in isolation
- Makes it simple to swap APIs or add caching later

**OpenMeteo API**
- Free, no authentication required - perfect for interview/demo
- Reliable weather data with good global coverage
- Separate endpoints for geocoding and weather keeps concerns separated
- Supports 7-day forecasts (with option to extend up to 16 days)

**Activity Scoring System**
- Transparent multi-factor scoring (temperature, wind, precipitation)
- Each activity has explicit logic based on weather conditions
- Returns sorted results (best activity first) for immediate usability
- Reasons provided for each score to explain recommendations

**Jest for Testing**
- Industry-standard testing framework
- ts-jest integration for TypeScript support
- Tests verify API integration works with real data (not mocked)
- Integration tests ensure end-to-end functionality

---

## Omissions & Trade-offs

### What Was Skipped and Why

**Caching**
- Omitted: No Redis or in-memory caching for weather/city data
- Why: 2-3 hour time constraint; OpenMeteo API is fast enough for demo
- Trade-off: More API calls, but acceptable for interview scope

**Error Handling**
- Omitted: Custom error types, detailed GraphQL error codes
- Why: Basic try/catch sufficient for demo; focused on core functionality
- Trade-off: Generic error messages, but failures are caught and logged

**Input Validation**
- Omitted: Validation of coordinate ranges, empty query strings
- Why: GraphQL schema provides basic type validation
- Trade-off: Could accept invalid coordinates (e.g., latitude > 90)

**Advanced Weather Conditions**
- Omitted: Weather code interpretation (snow, fog, thunderstorms)
- Why: Simplified to Sunny/Rainy based on precipitation only
- Trade-off: Less detailed conditions, but clearer logic

**Activity Scoring Refinement**
- Omitted: Time-of-day factors, sunrise/sunset, humidity, UV index
- Why: Focused on core weather factors (temp, wind, precipitation)
- Trade-off: Less accurate recommendations, but scoring logic is transparent

---

## Future Improvements

### How to Extend With More Time

**Caching Layer**
- Add Redis for weather data (TTL: 30 minutes)
- Cache city search results (TTL: 24 hours)
- Expected impact: 80% reduction in OpenMeteo API calls

**Enhanced Activity Logic**
- Add more activities (Hiking, Beach, Photography, Cycling)
- Factor in time of day, sunset/sunrise times
- Consider weather forecast trends (improving vs. worsening)
- Machine learning model trained on user preferences

**Database Integration**
- PostgreSQL with TypeORM for saved locations
- User favorite cities and activity preferences
- Historical weather tracking for trend analysis

**Advanced Features**
- Extended forecast support (up to 16 days, API supports it)
- Hourly forecasts in addition to daily summaries
- Activity recommendations by time slot (morning/afternoon/evening)
- Nearby points of interest (integrate third-party API)
- Travel route optimization based on weather patterns

**Production Readiness**
- Structured logging (Winston/Pino)
- Monitoring and metrics (Prometheus/DataDog)
- Rate limiting per client IP
- Comprehensive error codes and messages
- OpenAPI/GraphQL documentation

**Testing Improvements**
- Mock OpenMeteo API responses for faster tests
- Add E2E tests with Supertest
- Load testing with Artillery or k6
- Mutation testing to verify test quality

**Performance**
- GraphQL query complexity analysis
- DataLoader for batch requests
- Query result caching with Redis
- CDN for GraphQL responses (if read-heavy)

---

## AI Tool Usage

### How AI Was Used to Build This Project

**Initial Project Setup**
- AI generated boilerplate structure (folders, tsconfig, package.json)
- Scaffolded Apollo Server with Express integration
- Created Jest configuration for TypeScript

**API Integration**
- AI researched OpenMeteo API documentation
- Generated TypeScript interfaces matching API responses
- Wrote axios calls with proper error handling

**GraphQL Schema Design**
- AI designed type system (City, Weather, Activity types)
- Created query definitions with appropriate arguments
- Ensured schema matched resolver implementations

**Activity Scoring Logic**
- AI implemented scoring algorithms for all four activities
- Refined logic based on feedback (multi-factor reasons)
- Debugged scoring transparency issues

**Testing**
- AI wrote Jest tests for all three service functions
- Verified tests against real API responses
- Ensured tests covered happy paths and data validation

**Documentation**
- AI generated step-by-step README explaining each file
- Created this technical decisions document
- Wrote clear comments in code

**Debugging and Refinement**
- AI added debug logging to verify scoring accuracy
- Fixed incomplete scoring reasons based on feedback
- Removed debug logs for production-ready code

**Benefits of AI Usage**
- Rapid prototyping (completed in under 3 hours)
- Consistent code style and TypeScript best practices
- Comprehensive documentation created alongside code
- Testing implemented from the start (not added later)

**Human Oversight**
- Verified API integration with real data
- Tested GraphQL queries in Playground
- Reviewed scoring logic accuracy
- Made architectural decisions (service pattern, no caching)
