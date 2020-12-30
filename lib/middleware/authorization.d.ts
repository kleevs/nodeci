import { Request, Response } from "express";
export declare function basicAuth(users: () => UsersData): (req: Request, res: Response, next: () => void) => void;
export declare function toBasicAuth(login: string, password: string): string;
export declare function computeHash(authorization: string): string;
