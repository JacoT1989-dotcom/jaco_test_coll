import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Create Express app
const app = express();

// Create Apollo GraphQL server (v5)
const server = new ApolloServer({
  typeDefs,    // GraphQL schema (what data clients can request)
  resolvers,   // Functions that fetch the actual data
});

// Start server
async function startServer() {
  // Start Apollo server first
  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({}),
    })
  );

  const PORT = 4000;

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
