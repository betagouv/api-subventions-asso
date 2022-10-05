/* eslint-disable @typescript-eslint/no-namespace */
import express from "express";
import passport from "passport";

import cors from "cors";

import { RegisterRoutes } from "../tsoa/routes";
import { authMocks } from "./authentication/express.auth.hooks";
import { expressLogger } from "./middlewares/LogMiddleware";
import { AssetsMiddleware } from "./middlewares/AssetsMiddleware";
import { BodyParserJSON, BodyParserUrlEncoded } from "./middlewares/BodyParserMiddleware";
import { docsMiddlewares } from "./middlewares/DocsMiddleware";
import { errorHandler } from "./middlewares/ErrorMiddleware";
import RegisterSSERoutes from "./sse"
import StatsSearchMiddleware, { StatsSearchRoutesRegex } from "./middlewares/StatsSearchMiddleware";

const appName = 'api-subventions-asso';

export async function startServer(port = '8080', isTest = false) {
    port = process.env.PORT || port;
    const app = express();

    app.use(cors({
        origin: "*"
    }));

    if (!isTest) app.use(expressLogger());

    app.use("/assets", AssetsMiddleware);
    app.use(BodyParserUrlEncoded);
    app.use(BodyParserJSON);

    app.use(passport.initialize());

    authMocks(app); // Passport Part

    StatsSearchRoutesRegex.forEach(route => app.use(route, StatsSearchMiddleware));

    RegisterRoutes(app); // TSOA Part

    RegisterSSERoutes(app); // SSE Part

    app.use('/docs', ...(await docsMiddlewares()));

    app.use(errorHandler(isTest));

    return app.listen(port, () => {
        if (!isTest) console.log(`${appName} listening at http://localhost:${port}`);
    });
}