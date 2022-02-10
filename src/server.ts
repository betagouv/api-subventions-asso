import express from "express";
import passport from "passport"

import { RegisterRoutes } from "../tsoa/routes";
import { authMocks } from "./authentication/express.auth.hooks";
import { expressLogger } from "./middlewares/LogMiddleware";
import { AssetsMiddleware } from "./middlewares/AssetsMiddleware";
import { BodyParserJSON, BodyParserUrlEncoded } from "./middlewares/BodyParserMiddleware";
import { docsMiddlewares } from "./middlewares/DocsMiddleware";
import { errorHandler } from "./middlewares/ErrorMiddleware";

const appName = 'api-subventions-asso';

export async function startServer(port = '8080', isTest = false) {
    port = process.env.PORT || port;
    const app = express();

    if (!isTest) app.use(expressLogger());
    
    app.use("/assets", AssetsMiddleware);
    app.use(BodyParserUrlEncoded);
    app.use(BodyParserJSON);

    app.use(passport.initialize());

    authMocks(app); // Passport Part

    RegisterRoutes(app); // TSOA Part

    app.use('/docs', ...(await docsMiddlewares()));

    app.use(errorHandler);

    return app.listen(port, () => {
        if (!isTest) console.log(`${appName} listening at http://localhost:${port}`);
    });
}