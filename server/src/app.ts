import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v1 as Neo4j } from 'neo4j-driver';
import { ApolloServer } from 'apollo-server-express';
import { makeAugmentedSchema } from 'neo4j-graphql-js';

import { AuthHandler } from './auth/auth-handler';
import { resolvers } from './resolvers';

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

const driver = Neo4j.driver(NEO_URI, Neo4j.auth.basic(NEO_USR, NEO_PWD));
const auth = new AuthHandler(driver);

/**
 * Close Neo4j Driver on finish
 */
const finish = (req, res, next) => res.on('finish', () => driver.close()) && next();

/**
 * Define some REST endpoints / middleware to handle authentication with AuthHandler helper object.
 * 
 * In this setup SRV_PATH is protected by JWT.
 * This JWT can either be added as Bearer Authorization header or as the `token` query param.
 */
const endpoints = {
    '*': [
        cors(),
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        finish,
        auth.auth() // Add req.roles, req.user, req.token, req.authenticated to express Request object if token is provided
    ],
  //  [SRV_PATH]: [auth.isAuthenticated()],
    '/signup': [auth.signup()], // { email, password, name } = req.body; ...; res.send({ user })
    '/signin': [auth.signin()], // { email, password } = req.body; ...; res.send({ user, token })
    '/signout': [auth.isAuthenticated(), auth.signout()], // res.send({})
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
 * You can exclude generated queries / mutations from GQL_FILE by passing them as `exclude` to `config` object.
 * You may define your own resolvers (or extends the generated ones) by passing them to the `resolvers` object.
 * 
 * You may use custom middlewares in resolvers function
 *  
 */
const server = new ApolloServer({
    playground: !!PLAYGROUND, // disable in production
    context: ({ req, res }) => ({ req, res, driver, auth }),
    schema: makeAugmentedSchema({
        typeDefs: fs.readFileSync(GQL_FILE, 'utf8'),
        resolvers: resolvers,
        config: {
            query: { exclude: [] },
            mutation: { exclude: [] },
            auth: {
                isAuthenticated: true,
                hasRole: true
            }
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
