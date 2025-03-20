import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "core";

export function errorHandler(isTest: boolean) {
    return function (err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(400).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof Error) {
            if (!isTest) console.error(err);
            const statusCode = err instanceof HttpError ? err.status : 500;
            const errorCode = err instanceof HttpError ? err.code : undefined;
            return res.status(statusCode).json({
                message: err.message,
                code: errorCode,
            });
        }
        next();
    };
}
