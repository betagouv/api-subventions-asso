import { NextFunction, Request, Response } from "express";

const headers = {
    "Content-Security-Policy": "default-src 'none'",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "max-age=1800",
    "Access-Control-Allow-Headers": "sentry-trace, baggage",
};

export const headersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    for (const [headerKey, headerValue] of Object.entries(headers)) {
        res.setHeader(headerKey, headerValue);
    }
    next();
};
