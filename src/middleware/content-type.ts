import { Request, Response } from "express";

export function contentType(): (req: Request, res: Response, next: () => void) => void {
    return (req, res, next) => {
        res.setHeader('content-type', 'text/json');
        next();
    }
}