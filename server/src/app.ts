import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { v1 as Neo4j } from 'neo4j-driver';
import { ApolloServer } from 'apollo-server-express';
import { makeAugmentedSchema } from 'neo4j-graphql-js';

import { AuthHandler } from './auth/auth-handler';

/**
 * Load .env file
 */
dotenv.config();

/**
 * Load environment config
 */
const { SRV_PATH, SRV_PORT, NEO_URI, NEO_USR, NEO_PWD, GQL_FILE, PLAYGROUND } = process.env;

/**
 * Instanciate express Application, Neo4j driver and custom AuthHandler helper.
 */
const app = express();
app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

const driver = Neo4j.driver(NEO_URI, Neo4j.auth.basic(NEO_USR, NEO_PWD));
const auth = new AuthHandler(driver);

/**
 * Define some REST endpoints / middleware to handle authentication with AuthHandler helper object.
 * 
 * In this setup SRV_PATH is protected by JWT.
 * This JWT can either be added as Bearer Authorization header or as the `token` query param.
 */
const endpoints = {
    '*': [auth.auth()],
    '/signup': [auth.signup()],
    '/signin': [auth.signin()],
    '/signout': [auth.isAuthenticated(), auth.signout()],
    [SRV_PATH]: [auth.isAuthenticated()],
};

/**
 * Apply all defined middlewares
 */
Object.keys(endpoints).forEach(endpoint => app.use(endpoint, ...endpoints[endpoint]));

/**
 * Instanciate Apollo server by passing to it:
 *  - the Neo4j driver in the `context`
 *  - this neo4j-graphql-js augmented schema
 * 
 * You can add resolver's middleware into the `context` function.
 * 
 * You can exclude generated queries / mutations from GQL_FILE by passing them as `exclude` to `config` object.
 * You may define your own resolvers for excluded queries / mutations by passing them to the `resolvers` object.
 */
const server = new ApolloServer({
    playground: !!PLAYGROUND,
    context: ({ req }) => {
        auth.augmentRequest(req);
        return { req, driver };
    },
    schema: makeAugmentedSchema({
        typeDefs: fs.readFileSync(GQL_FILE, 'utf8'),
        resolvers: {},
        config: {
            query: { exclude: [] },
            mutation: { exclude: ['User', 'Role'] }
        }
    }),
});

/**
 * Apply the Apollo GraphQL endpoint middleware
 */
server.applyMiddleware({ app, path: SRV_PATH });

/**
 * Start application
 */
app.listen({ port: SRV_PORT }, () => {
	console.log(`Server listening at http://localhost:${SRV_PORT}${SRV_PATH}`);
});
