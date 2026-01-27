import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "core";

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
        if (err instanceof HttpError) {
            if (!isTest) console.error(err);

            let response: Record<string, string | number> = { message: err.message };
            if (err.code) response.code = err.code;
            if (err.cause) response = { ...response, ...err.cause };
            return res.status(err.status).json(response);
        }

        /**
         * Generic error handling
         */
        if (err instanceof Error) {
            if (!isTest) console.error(err);

            return res.status(500).json({
                message: err.message,
            });
        }

        next();
    };
}
