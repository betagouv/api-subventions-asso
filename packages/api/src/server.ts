/* eslint-disable @typescript-eslint/no-namespace */
import express, { NextFunction, Response } from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import cors from "cors";

import MongoStoreBuilder = require("connect-mongodb-session");
import { RegisterRoutes } from "../tsoa/routes";
import { registerAuthMiddlewares } from "./authentication/express.auth.hooks";
import { expressLogger } from "./middlewares/LogMiddleware";
import { AssetsMiddleware } from "./middlewares/AssetsMiddleware";
import { BodyParserJSON, BodyParserUrlEncoded } from "./middlewares/BodyParserMiddleware";
import { docsMiddlewares } from "./middlewares/DocsMiddleware";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import RegisterSSERoutes from "./sse";
import StatsAssoVisitMiddleware, { StatsAssoVisitRoutesRegex } from "./middlewares/StatsAssoVisitMiddleware";
import UserActivityMiddleware from "./middlewares/UserActivityMiddleware";
import { IdentifiedRequest } from "./@types";
import { initCron } from "./cron";
import { headersMiddleware } from "./middlewares/headersMiddleware";
import { ENV } from "./configurations/env.conf";
import { SESSION_SECRET } from "./configurations/agentConnect.conf";
import { mongoSessionStoreConfig } from "./shared/MongoConnection";

const appName = "api-subventions-asso";
const MongoStore = MongoStoreBuilder(session);

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

    if (ENV !== "dev" && ENV !== "test") Sentry.init({ release: process.env.npm_package_version });
    app.use(Sentry.Handlers.requestHandler());
    app.use(cookieParser());
    app.use(
        session({
            pauseStream: false,
            secret: SESSION_SECRET,
            resave: false, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            store: new MongoStore(mongoSessionStoreConfig),
        }),
    );
    app.use(
        cors({
            credentials: true,
            origin: true,
        }),
    );

    if (!isTest) app.use(expressLogger());

    app.use("/assets", AssetsMiddleware);
    app.use(BodyParserUrlEncoded);
    app.use(BodyParserJSON);

    app.use(passport.initialize());

    await registerAuthMiddlewares(app); // Passport Part

    StatsAssoVisitRoutesRegex.forEach(route =>
        app.use(route, (req, res, next) =>
            factoryEndMiddleware(req as IdentifiedRequest, res, next, StatsAssoVisitMiddleware),
        ),
    );

    app.use((req, res, next) => UserActivityMiddleware(req as IdentifiedRequest, res, next));

    app.use(headersMiddleware);

    RegisterRoutes(app); // TSOA Part

    RegisterSSERoutes(app); // SSE Part

    app.use("/docs", ...(await docsMiddlewares()));

    app.use(Sentry.Handlers.errorHandler());

    app.use(errorHandler(isTest));

    initCron();

    return app.listen(port, () => {
        if (!isTest) console.log(`${appName} listening at http://localhost:${port}`);
    });
}
