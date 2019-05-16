import { v1 as Neo4 } from 'neo4j-driver';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class Auth {

    private secret = process.env.JWT_SECRET;

    constructor(
        private driver: Neo4.Driver,
    ) {}

    private userByEmail(email: string) {
        const session = this.driver.session();
        return session.run(`
            MATCH (user: User { email: "${email}" })
            RETURN user
            LIMIT 1
        `)
            .then(({ records: { 0: result } }) => {
                const user = result && result.get('user');
                return user;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => session.close());
    }

    private createUser(email: string, password: string, name: string) {
        const session = this.driver.session();
        return session.run(`
            MATCH (role: Role { name: "user" })
            CREATE
                (user: User { email: "${email}", password: "${password}", name: "${name}" }),
                (user)-[: HAS_ROLE { createdAT: date() }]->(role)
            RETURN user { .email .name } as user
        `)
            .then(({ records: { 0: result } }) => {
                const user = result && result.get('user');
                return user;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => session.close());
    }

    private setToken(req: Request) {
        if (req.query.token) {
            req['JWT'].token = req.query.token;
        } else if (req.headers.authorization) {
            const bearer = req.headers.authorization.split(' ');
            req['JWT'].token = bearer.length > 1 ? bearer[1] : undefined;
        }
        return req['JWT'].token || '';
    }

    private setClaims(req: Request, claims: any) {
        req['JWT'].isAuthenticated = !!claims;
        req['JWT'].user = claims && claims.user;
        req['JWT'].roles = claims && claims.roles;
    }

    private encodeJWT(user: any, roles: { [domain: string]: string[] }) {
        return jwt.sign({ user, roles: { ...roles }, }, this.secret);
    }

    private verifyJWT(token: string) {
        let claims: any;
        try {
            claims = jwt.verify(token, this.secret);
        } catch (error) {
        }
        return claims;
    }

    auth() {
        return (req: Request, res: Response, next: NextFunction) => {
            req['JWT'] = {};
            const token = this.setToken(req);
            const claims = this.verifyJWT(token);
            this.setClaims(req, claims);
            next();
        };
    }

    applyMiddleware(middleware: (req: Request, res: Response, next: NextFunction, auth: any) => void) {
        return  (req: Request, res: Response, next: NextFunction) => {
            middleware(req, res, next, req['JWT']);
        }
    }

    signup() {
        return (req: Request, res: Response) => {
            const fields = ['email', 'password', 'name'];
            const missing = fields.filter(field => !Object.keys(req.body).includes(field));
            const { email, password, name } = req.body;
            if (missing.length > 0) {
                res.status(400).send({ message: `Missing fields ${missing}` });
                return ;
            }
            this.userByEmail(email).then(user => {
                if (user) {
                    res.status(401).send({ message: `Email already in use` });
                    return ;
                }
                this.createUser(email, password, name).then(created => {
                    if (!created) {
                        res.status(500).send({ message: `Something went wrong` });
                        return ;
                    }
                    res.send({ user: created });
                })
            });
        };
    }

    signin() {
        return (req: Request, res: Response, next: NextFunction) => {
        };
    }

    signout() {
        return (req: Request, res: Response, next: NextFunction) => {
        };
    }
}