import express, { NextFunction, Response } from "express";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import cors from "cors";

import MongoStoreBuilder from "connect-mongodb-session";
import { RegisterRoutes } from "../tsoa/routes";
import { registerAuthMiddlewares } from "./authentication/express.auth.hooks";
import { expressLogger } from "./middlewares/log.middleware";
import { assetsMiddleware } from "./middlewares/assets.middleware";
import { urlEncoded, json } from "./middlewares/body-parser.middleware";
import { docsMiddlewares } from "./middlewares/docs.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import assoVisitMiddleware, { StatsAssoVisitRoutesRegex } from "./middlewares/asso-visit.middleware";
import userActivityMiddleware from "./middlewares/user-activity.middleware";
import { IdentifiedRequest } from "./@types";
import { initCron } from "./cron";
import { headersMiddleware } from "./middlewares/headers.middleware";
import { DEV, ENV, PROD } from "./configurations/env.conf";
import { SESSION_SECRET } from "./configurations/pro-connect.conf";
import { mongoSessionStoreConfig } from "./shared/MongoConnection";
import { FRONT_OFFICE_URL } from "./configurations/front.conf";

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

    // must be before passport auth and other middlewares
    app.use(
        cors(function (req, callback) {
            const frontAuth = {
                credentials: true,
                origin: FRONT_OFFICE_URL,
            };
            const defaultAuth = {
                credentials: false,
                origin: true,
            };
            if (req?.headers.origin === FRONT_OFFICE_URL) return callback(null, frontAuth);
            return callback(null, defaultAuth);
        }),
    );

    if (ENV !== "dev" && ENV !== "test") Sentry.init({ release: process.env.npm_package_version });
    app.use(cookieParser());
    app.use(
        session({
            secret: SESSION_SECRET,
            resave: false, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            store: new MongoStore(mongoSessionStoreConfig),
            pauseStream: false,
            cookie: {
                secure: PROD,
                httpOnly: true,
                sameSite: "lax",
            },
        }),
    );

    if (!isTest) app.use(expressLogger());

    const LIMIT = process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT, 10) : 20;

    const limiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        limit: LIMIT, // Limit each IP to X requests per `window`
        standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    });
    // NB : if app is deployed on a multi server infrastructure, use store like "rate-limit-mongo"
    app.use(limiter);

    app.use("/assets", assetsMiddleware);
    app.use(urlEncoded);
    app.use(json);

    app.use(passport.initialize());

    await registerAuthMiddlewares(app); // Passport Part

    StatsAssoVisitRoutesRegex.forEach(route =>
        app.use(route, (req, res, next) =>
            factoryEndMiddleware(req as IdentifiedRequest, res, next, assoVisitMiddleware),
        ),
    );

    app.use((req, res, next) => userActivityMiddleware(req as IdentifiedRequest, res, next));

    app.use(headersMiddleware);

    RegisterRoutes(app); // TSOA Part

    app.use("/docs", ...(await docsMiddlewares()));

    Sentry.setupConnectErrorHandler(app);

    app.use(errorHandler(isTest));

    initCron();

    if (DEV) {
        //@ts-expect-error : No type
        return app.listen(port, "localhost", () => {
            if (!isTest) console.log(`${appName} listening at http://localhost:${port}`);
        });
    }

    return app.listen(port, () => {
        if (!isTest) console.log(`${appName} listening at http://localhost:${port}`);
    });
}
