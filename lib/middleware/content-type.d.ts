import { Request, Response } from "express";
export declare function contentType(): (req: Request, res: Response, next: () => void) => void;
