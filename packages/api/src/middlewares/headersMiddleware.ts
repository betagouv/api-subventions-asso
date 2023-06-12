import { NextFunction, Request, Response } from "express";

const headers = {
    "Content-Security-Policy": "default-src 'none'",
};

export const headersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    for (const [headerKey, headerValue] of Object.entries(headers)) {
        res.setHeader(headerKey, headerValue);
    }
    next();
};
