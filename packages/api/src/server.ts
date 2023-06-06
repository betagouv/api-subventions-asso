/* eslint-disable @typescript-eslint/no-namespace */
import express, { NextFunction, Response } from "express";
import passport from "passport";
import * as Sentry from "@sentry/node";

import cors from "cors";

import { RegisterRoutes } from "../tsoa/routes";
import { authMocks } from "./authentication/express.auth.hooks";
import { expressLogger } from "./middlewares/LogMiddleware";
import { AssetsMiddleware } from "./middlewares/AssetsMiddleware";
import { BodyParserJSON, BodyParserUrlEncoded } from "./middlewares/BodyParserMiddleware";
import { docsMiddlewares } from "./middlewares/DocsMiddleware";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import RegisterSSERoutes from "./sse";
import StatsSearchMiddleware, { StatsSearchRoutesRegex } from "./middlewares/StatsSearchMiddleware";
import StatsAssoVisitMiddleware, { StatsAssoVisitRoutesRegex } from "./middlewares/StatsAssoVisitMiddleware";
import { IdentifiedRequest } from "./@types";
import { initCron } from "./cron";

const appName = "api-subventions-asso";

async function factoryEndMiddleware(
    req: IdentifiedRequest,
    res: Response,
    next: NextFunction,
    middleware: (req: IdentifiedRequest, res: Response) => void,
) {
    res.on("finish", () => middleware(req, res));
    next();
}

export async function startServer(port = "8080", isTest = false) {
    port = process.env.PORT || port;
    const app = express();

    Sentry.init({ release: process.env.npm_package_version });
    app.use(Sentry.Handlers.requestHandler());

    app.use(
        cors({
            origin: "*",
        }),
    );

    if (!isTest) app.use(expressLogger());

    app.use("/assets", AssetsMiddleware);
    app.use(BodyParserUrlEncoded);
    app.use(BodyParserJSON);

    app.use(passport.initialize());

    authMocks(app); // Passport Part

    StatsSearchRoutesRegex.forEach(route => app.use(route, StatsSearchMiddleware));
    StatsAssoVisitRoutesRegex.forEach(route =>
        app.use(route, (req, res, next) =>
            factoryEndMiddleware(req as IdentifiedRequest, res, next, StatsAssoVisitMiddleware),
        ),
    );

    RegisterRoutes(app); // TSOA Part

    app.get("/debug-sentry", function mainHandler(req, res) {
        throw new Error("My first Sentry error!");
    });

    RegisterSSERoutes(app); // SSE Part

    app.use("/docs", ...(await docsMiddlewares()));

    app.use(Sentry.Handlers.errorHandler());

    app.use(errorHandler(isTest));

    initCron();

    return app.listen(port, () => {
        if (!isTest) console.log(`${appName} listening at http://localhost:${port}`);
    });
}
