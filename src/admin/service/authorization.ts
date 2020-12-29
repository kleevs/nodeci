import { Request, Response } from "express";
import { createHash } from 'crypto';

export function basicAuth(users: () => Users): (req: Request, res: Response, next: () => void) => void {
    return (req, res, next) => {
        const authorization = req.headers?.authorization?.split(';').filter(_ => _.startsWith('Basic '))[0];
        const [,basicAuthorization] = authorization?.split(' ');
        if (req.hostname === 'localhost' && req.originalUrl === '/user') {
            next();
            return;
        }

        if (basicAuthorization) {
            const buff = Buffer.from(basicAuthorization, 'base64');
            const [login] = buff.toString('utf8').split(':');
            const hash = computeHash(basicAuthorization);
            if (users()[login]?.password === hash) {
                next();
                return
            }
        }

        res.status(401);
        res.end('Non autorisé');
    }
}

export function toBasicAuth(login: string, password: string) {
    return Buffer.from(`${login}:${password}`, 'utf8').toString('base64');
}

export function computeHash(authorization: string) {
    return createHash('sha256').update(authorization).digest('base64');
}