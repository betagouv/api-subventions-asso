import { LogEntry } from "winston";
import { Request } from "express";
import { UserDto } from "dto";

export type LoggedMeta = {
    // made from the whiteList configured in LogMiddleware.ts
    req: Partial<Pick<Request, "url" | "method" | "httpVersion" | "originalUrl" | "query" | "body" | "headers">> & {
        user?: UserDto; // user replaced with our own user entity from JWT in express.auth.hooks.ts
    };
    // define res when needed somewhere
    res: Record<string, unknown>;
    responseTime: number;
};

export type WinstonLog = LogEntry & { meta: LoggedMeta; timestamp: Date };
