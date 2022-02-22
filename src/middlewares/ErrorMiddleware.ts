import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";


export function errorHandler(isTest: boolean) {

    return function (
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                success: false,
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof Error) {
            if (!isTest) console.error(err);
            const statusCode = (err as unknown as { status: number}).status || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message,
            });
        }
        next();
    }
}