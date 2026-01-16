import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "core";
import { PathParamError } from "../interfaces/http/@errors/PathParamError";

export function errorHandler(isTest: boolean) {
    return function (err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
        /**
         * TSOA Validation error handling
         */
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            // TODO: change this for 422 as it is more accurate
            return res.status(400).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }

        /**
         * Custom errors handling
         */
        if (err instanceof PathParamError) {
            console.warn("Caught Path Param Error for $s:", req.path, err);
            return res.status(400).json({
                message: err.message,
                ...err.cause,
            });
        }

        /**
         * Generic error handling
         */
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
