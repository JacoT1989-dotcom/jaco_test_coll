import dotenv from 'dotenv';
// Load environment variables based on NODE_ENV
// In production, Vercel/hosting providers set env vars automatically
// In development, load from .env.local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Create Apollo GraphQL server
const server = new ApolloServer({
  typeDefs,    // GraphQL schema (what data clients can request)
  resolvers,   // Functions that fetch the actual data
});

// Start server
async function startServer() {
  const port = parseInt(process.env.PORT || '4000', 10);
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀 Server running at ${url}`);
}

startServer();
