import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Create Express app
const app = express();

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.applyMiddleware({ app: app as any });

  const PORT = 4000;

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
