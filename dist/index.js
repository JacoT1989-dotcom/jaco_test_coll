"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
// Create Express app
const app = (0, express_1.default)();
// Create Apollo GraphQL server (v4)
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs, // GraphQL schema (what data clients can request)
    resolvers: // GraphQL schema (what data clients can request)
    resolvers_1.resolvers, // Functions that fetch the actual data
});
// Start server
async function startServer() {
    // Start Apollo server first
    await server.start();
    // Apply middleware
    app.use('/graphql', (0, cors_1.default)(), body_parser_1.default.json());
    // GraphQL endpoint
    app.post('/graphql', async (req, res) => {
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
