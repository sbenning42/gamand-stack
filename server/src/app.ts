import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import { v1 as Neo4j } from 'neo4j-driver';
import { ApolloServer } from 'apollo-server-express';
import { makeAugmentedSchema } from 'neo4j-graphql-js';


dotenv.config();

const { SRV_PATH, SRV_PORT, NEO_URI, NEO_USR, NEO_PWD, GQL_FILE, PLAYGROUND } = process.env;

const app = express();

const driver = Neo4j.driver(NEO_URI, Neo4j.auth.basic(NEO_USR, NEO_PWD));

const server = new ApolloServer({
    playground: !!PLAYGROUND,
    context: ({ req }) => ({ req, driver }),
    schema: makeAugmentedSchema({
        typeDefs: fs.readFileSync(GQL_FILE, 'utf8'),
        resolvers: {},
        config: {
            query: { exclude: [] },
            mutation: { exclude: [] }
        }
    }),
});

server.applyMiddleware({
    app,
    path: SRV_PATH,
    cors: true,
    bodyParserConfig: true
});

app.listen({ port: SRV_PORT }, () => {
	console.log(`Server listening at http://localhost:${SRV_PORT}${SRV_PATH}`);
});
