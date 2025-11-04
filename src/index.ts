import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Create Express app
const app: Express = express();

// Create Apollo GraphQL server
const server = new ApolloServer({
  typeDefs,    // GraphQL schema (what data clients can request)
  resolvers,   // Functions that fetch the actual data
});

// Start server
async function startServer() {
  // Start Apollo server first
  await server.start();

  // Connect Apollo to Express
  // Type assertion needed due to Express v5 compatibility with Apollo Server v3
  server.applyMiddleware({ app: app as unknown as Parameters<typeof server.applyMiddleware>[0]['app'] });

  const PORT = 4000;

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
