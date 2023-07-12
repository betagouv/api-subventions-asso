import { NextFunction, Request, Response } from "express";
import { DATASUB_URL } from "../shared/config";

const cspHeaderValueByDirective = {
    "default-src": "'self'",
    "connect-src": `'self' ${DATASUB_URL} https://client.crisp.chat/ wss://client.relay.crisp.chat/w/b1/ https://storage.crisp.chat wss://stream.relay.crisp.chat https://stats.data.gouv.fr`,
    "font-src": "'self' https://client.crisp.chat",
    "img-src": "'self' data: https://image.crisp.chat https://client.crisp.chat https://storage.crisp.chat",
    "script-src":
        "'unsafe-inline' 'unsafe-eval' 'self' https://client.crisp.chat https://settings.crisp.chat https://stats.data.gouv.fr",
    "style-src": "'self' https://client.crisp.chat 'unsafe-inline'",
    "frame-src": "'self' https://game.crisp.chat",
};

function toCspHeaderValue(dict: Record<string, string>) {
    return Object.entries(dict)
        .map(([directiveKey, directiveValue]) => `${directiveKey} ${directiveValue}`)
        .join("; ");
}

const headers = {
    "Content-Security-Policy": toCspHeaderValue(cspHeaderValueByDirective),
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "max-age 1800",
};

export const headersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    for (const [headerKey, headerValue] of Object.entries(headers)) {
        res.setHeader(headerKey, headerValue);
    }
    next();
};
