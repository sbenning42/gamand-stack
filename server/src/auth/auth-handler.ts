import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { v1 as Neo4j } from 'neo4j-driver';

export class AuthHandler {

    /**
     * use to encode / sign JWT
     */
    private secret = process.env.JWT_SECRET;
    
    /**
     * raw cypher's queries
     */
    private cypherQueries = {
        findUser: (email: string) => `
            MATCH (user: User { email: "${email}" })
            RETURN user
            LIMIT 1
        `,
        createUser: (email: string, password: string, name: string) => `
            MATCH (role: Role { name: "user" })
            CREATE
                (user: User {
                    email: "${email}",
                    password: "${password}",
                    name: "${name}"
                }),
                (user)-[:HAS_ROLE]->(role)
            RETURN user { ._id, .email, .name } as user
        `,
        isAdminUser: (email: string) => `
                MATCH (user: User { email: "${email}" })-[:HAS_ROLE]->(role: Role { name: "admin" })
                RETURN user
                LIMIT 1
        `,
        invalidateToken: (token: string) => `
            CREATE (invalidToken: InvalidToken { token: "${token}" })
            RETURN invalidToken
        `,
        isInvalidToken: (token: string) => `
            MATCH (invalidToken: InvalidToken { token: "${token}" })
            RETURN invalidToken
            LIMIT 1
        `,
    };

    /**
     * Helper functions to run cypher's queries
     */
    private runCypherQueries = {
        findUser: (email: string) => {
            const session = this.driver.session();
            return session.run(this.cypherQueries.findUser(email))
                .then(({ records: { 0: result } }) => result && result.get('user'));
        },
        createUser: (email: string, password: string, name: string) => {
            const session = this.driver.session();
            return session.run(this.cypherQueries.createUser(email, password, name))
                .then(({ records: { 0: result } }) => {
                    return result && result.get('user');
                });
        },
        isAdminUser: (email: string) => {
            const session = this.driver.session();
            return session.run(this.cypherQueries.isAdminUser(email))
                .then(({ records: { 0: result } }) => result && result.get('user'));
        },
        invalidateToken: (token: string) => {
            const session = this.driver.session();
            return session.run(this.cypherQueries.invalidateToken(token))
                .then(({ records: { 0: result } }) => result && result.get('invalidToken'));
        },
        isInvalidToken: (token: string) => {
            const session = this.driver.session();
            return session.run(this.cypherQueries.isInvalidToken(token))
                .then(({ records: { 0: result } }) => !!(result && result.get('invalidToken')));
        },
    };

    constructor(private driver: Neo4j.Driver) {}

    private isTokenProvidedInHeaders(req: Request) {
        return req.headers.authorization && req.headers.authorization.startsWith('Bearer ');
    }
    private isTokenProvidedInQuery(req: Request) {
        return !!req.query.token;
    }

    private retreiveTokenFromHeaders(req: Request) {
        return this.isTokenProvidedInHeaders(req)
            ? req.headers.authorization.split(' ')[1]
            : '';
    } 
    private retreiveTokenFromQuery(req: Request) {
        return req.query.token || '';
    } 
    
    /**
     * Check if `token` is provided in `Authorization` header or in `token`query param
     */
    isTokenProvided(req: Request) {
        return this.isTokenProvidedInHeaders(req) || this.isTokenProvidedInQuery(req);
    }

    /**
     * Retreive the `token` from `Authorization` header or from `token`query param
     */
    retreiveToken(req: Request) {
        return this.retreiveTokenFromHeaders(req) || this.retreiveTokenFromQuery(req);
    }

    /**
     * Encode data as JWT
     */
    encodeData(data: any) {
        return jwt.sign(data, this.secret);
    }
    /**
     * Decode data from JWT
     */
    decodeData(token: string) {
        return jwt.decode(token);
    }
    /**
     * Decode data from JWT and verify it's signature
     */
    verifyToken(token: string) {
        return jwt.verify(token, this.secret);
    }

    /**
     * Try ro retreive `token`
     * If it is provided and it is a valid one, set `authenticated`, `user` and `token` in the Request object
     * 
     * Otherwise, don't do nothing
     */
    augmentRequest(req: Request) {
        const token = this.retreiveToken(req);
        if (!token) {
            return Promise.resolve(req);
        }
        let user: any;
        try {
            user = this.verifyToken(token);
        } catch (error) {
            return Promise.resolve(req);
        }
        return this.runCypherQueries.isInvalidToken(token)
            .then(invalid => {
                if (!invalid) {
                    req['authenticated'] = !!user;
                    req['user'] = user;
                    req['token'] = token;
                }
                return req;
            });
    }

    /**
     * Create an user Object and assign to it the `user` role
     */
    signup() {
        return (req: Request, res: Response) =>  {
            const { email, password, name } = req.body;
            if (!(email && password && name)) {
                const missingFields = ['email', 'password', 'name']
                    .filter(param => req.body[param] === undefined)
                    .reduce((params, param) => params ? `${params}, ${param}` : param, '');
                res.status(400).send({ message: `Missing fields: [${missingFields}]` });
                return ;
            }
            this.runCypherQueries.findUser(email)
                .then(user => {
                    if (user) {
                        res.status(400).send({ message: `Email already exists` });
                        return ;
                    }
                    return this.runCypherQueries.createUser(email, password, name)
                        .then(created => {
                            if (!created) {
                                res.status(500).send({ message: `Something went wrong` });
                                return ;
                            }
                            res.send({ user: created });
                        });
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send({ message: `Something went wrong`, error });
                });
        };
    }
    
    /**
     * Sign an user in
     */
    signin() {
        return (req: Request, res: Response) =>  {
            const { email, password } = req.body;
            if (!(email && password)) {
                const missingFields = ['email', 'password']
                    .filter(param => req.body[param] === undefined)
                    .reduce((params, param) => params ? `${params}, ${param}` : param, '');
                res.status(400).send({ message: `Missing fields: [${missingFields}]` });
                return ;
            }
            this.runCypherQueries.findUser(email)
                .then(user => {
                    if (!user || user.properties.password !== password) {
                        res.status(500).send({ message: `Wrong credentials` });
                        return ;
                    }
                    const token = this.encodeData(user.properties);
                    delete user.properties.password;
                    res.send({ user: user.properties, token });
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send({ message: `Something went wrong`, error });
                });
        };
    }
    
    
    /**
     * Sign an user out
     */
    signout() {
        return (req: Request, res: Response) =>  {
            const token = req['token'];
            this.runCypherQueries.invalidateToken(token)
                .then(() => {
                    res.send({});
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send({ message: `Something went wrong`, error });
                });
        };
    }
    
    /**
     * Is Authenticated middleware
     */
    isAuthenticated() {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req['authenticated']) {
                res.status(401).send({ message: 'Not authorized' });
                return ;
            }
            next();
        };
    }

    /**
     * Is Admin Resolvers middleware
     */
    isAdmin(req: Request, res: Response) {
        const user = req['user'];
        return this.runCypherQueries.isAdminUser(user && user.email)
            .then(user => {
                if (!user) {
                    res.status(401);
                    throw new Error('Not authorized');
                } else {
                    req['admin'] = true;
                    return req;
                }
            })
            .catch(error => {
                res.status(401);
                throw new Error('Not authorized');
            });
    }

    /**
     * Authentication helper middleware (use it everywhere you want to have authentication support)
     */
    auth() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.augmentRequest(req).then(() => next());
        };
    }

}