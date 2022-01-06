import express from 'express';
import { connectDB } from './shared/MongoConnection';

import { router as searchRouter, path as searchPath } from "./modules/search/interfaces/http/search.controller";

const appName = 'datasubvention';
const port = process.env.PORT || 8080;

async function main() {
    await connectDB();

    const app = express();

    app.use(searchPath, searchRouter);

    app.get('/', (req, res) => {
        res.send('Hello World');
    });
    
    app.listen(port, () => {
        console.log(`${appName} listening at http://localhost:${port}`);
    });
}

main();