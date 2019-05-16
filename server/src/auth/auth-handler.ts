import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { v1 as Neo4j } from 'neo4j-driver';

export class AuthHandler {

    private secret = process.env.JWT_SECRET;
    
    cypherQueries = {
        findUser: (email: string) => `
            MATCH (user: User { email: "${email}" })
            RETURN user
            LIMIT 1
        `,
        createUser: (email: string, password: string, name: string) => `
            CREATE (user: User {
                email: "${email}",
                password: "${password}",
                name: "${name}"
            })
            RETURN user
        `,
    };

    runCypherQueries = {
        findUser: (driver: Neo4j.Driver, email: string) => {
            const session = driver.session();
            return session.run(this.cypherQueries.findUser(email))
                .then(({ records: { 0: result } }) => result && result.get('user'));
        },
        createUser: (driver: Neo4j.Driver, email: string, password: string, name: string) => {
            const session = driver.session();
            return session.run(this.cypherQueries.createUser(email, password, name))
                .then(({ records: { 0: result } }) => result && result.get('user'));
        },
    };

    constructor() {}

    isTokenProvidedInHeaders(req: Request) {
        return req.headers.authorization && req.headers.authorization.includes('Bearer ');
    }
    isTokenProvidedInQuery(req: Request) {
        return !!req.query.token;
    }
    isTokenProvided(req: Request) {
        return this.isTokenProvidedInHeaders(req) || this.isTokenProvidedInQuery(req);
    }

    retreiveTokenFromHeaders(req: Request) {
        return this.isTokenProvidedInHeaders(req)
            ? req.headers.authorization.split(' ')[1]
            : '';
    } 
    retreiveTokenFromQuery(req: Request) {
        return req.query.token || '';
    } 
    retreiveToken(req: Request) {
        return this.retreiveTokenFromHeaders(req) || this.retreiveTokenFromQuery(req);
    }

    encodeData(data: any) {
        return jwt.sign(data, this.secret);
    }
    decodeData(token: string) {
        return jwt.decode(token);
    }
    verifyToken(token: string) {
        return jwt.verify(token, this.secret);
    }

    augmentRequest(req: Request) {
        const token = this.retreiveToken(req);
        if (!token) {
            return req;
        }
        try {
            const user = this.verifyToken(token);
            req['authenticated'] = !!user;
            req['user'] = user;
            req['token'] = token;
        } catch (error) {
            return req;
        }
        return req;
    }

    signupMiddleware() {
        return (req: Request, res: Response, next: NextFunction) =>  {
            const { email, password, name } = req.body;
            const driver = req['driver'];
            if (!(email && password && name)) {
                const missingFields = ['email', 'password', 'name']
                    .filter(param => req.body[param] === undefined)
                    .reduce((params, param) => params ? `${params}, ${param}` : param, '');
                res.status(400).send({ message: `Missing fields: [${missingFields}]` });
                return ;
            }
            this.runCypherQueries.findUser(driver, email)
                .then(user => {
                    if (user) {
                        res.status(400).send({ message: `Email already exists` });
                        return ;
                    }
                    return this.runCypherQueries.createUser(driver, email, password, name)
                        .then(created => {
                            if (!created) {
                                res.status(500).send({ message: `Something went wrong` });
                                return ;
                            }
                            delete created.properties.password;
                            res.send({ user: created.properties });
                        });
                })
                .catch(error => {
                    res.status(500).send({ message: `Something went wrong`, error });
                });
        };
    }
    
    signinMiddleware() {
        return (req: Request, res: Response, next: NextFunction) =>  {
            const { email, password } = req.body;
            if (!(email && password)) {
                const missingFields = ['email', 'password']
                    .filter(param => req.body[param] === undefined)
                    .reduce((params, param) => params ? `${params}, ${param}` : param, '');
                res.status(400).send({ message: `Missing fields: [${missingFields}]` });
                return ;
            }
            this.runCypherQueries.findUser(req['driver'], email)
                .then(user => {
                    if (!user || user.properties.password !== password) {
                        res.status(500).send({ message: `Wrong credentials` });
                        return ;
                    }
                    delete user.properties.password;
                    const token = this.encodeData(user.properties);
                    res.send({ user: user.properties, token });
                })
                .catch(error => {
                    res.status(500).send({ message: `Something went wrong`, error });
                });
        };
    }
    
    signoutMiddleware() {
        return (req: Request, res: Response, next: NextFunction) =>  {};
    }

    isLoggedMiddleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req['authenticated']) {
                res.status(401).send({ message: 'Not authorized' });
                return ;
            }
            next();
        };
    }

    authMiddleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.augmentRequest(req);
            next();
        };
    }

}