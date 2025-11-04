import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Create Express app
const app = express();

// Create Apollo GraphQL server (v4)
const server = new ApolloServer({
  typeDefs,    // GraphQL schema (what data clients can request)
  resolvers,   // Functions that fetch the actual data
});

// Start server
async function startServer() {
  // Start Apollo server first
  await server.start();

  // Apply middleware
  app.use('/graphql', cors(), bodyParser.json());

  // GraphQL endpoint
  app.post('/graphql', async (req: Request, res: Response) => {
    const { body } = req;
    const result = await server.executeOperation(body, {
      contextValue: {},
    });

    res.status(200).json(result);
  });

  const PORT = 4000;

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
