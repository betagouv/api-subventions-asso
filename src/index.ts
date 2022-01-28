import "reflect-metadata";
import 'dotenv/config'

import path from "path";
import express from "express";
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from "../tsoa/routes";
import { connectDB } from './shared/MongoConnection';


const appName = 'datasubvention';
const port = process.env.PORT || 8080;

async function main() {
    await connectDB();

    const app = express();
    
    app.use("/assets", express.static(path.resolve(__dirname, '../assets')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    RegisterRoutes(app);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    app.use('/', swaggerUi.serve, swaggerUi.setup(await import('../tsoa/swagger.json'), {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Data Subvention",
        customfavIcon: "/assets/images/favicons/favicon.ico"
    }));


    app.listen(port, () => {
        console.log(`${appName} listening at http://localhost:${port}`);
    });
}

main();