"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
// Create Express app
const app = (0, express_1.default)();
// Create Apollo GraphQL server
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.typeDefs, // GraphQL schema (what data clients can request)
    resolvers: // GraphQL schema (what data clients can request)
    resolvers_1.resolvers, // Functions that fetch the actual data
});
// Start server
async function startServer() {
    // Start Apollo server first
    await server.start();
    // Connect Apollo to Express
    // Type assertion needed due to Express v5 compatibility with Apollo Server v3
    server.applyMiddleware({ app: app });
    const PORT = 4000;
    // Start listening for requests
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}
startServer();
