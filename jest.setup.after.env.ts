/* eslint-disable @typescript-eslint/no-empty-function */
jest.spyOn(console, 'info').mockImplementation(() => {});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => {});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jest.spyOn(process.stdout, 'cursorTo').mockImplementation(() => {});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jest.spyOn(process.stdout, 'write').mockImplementation(() => {});

// eslint-disable-next-line @typescript-eslint/no-var-requires
process.env.JWT_SECRET = require('crypto').randomBytes(256).toString('base64');


import { existsSync, mkdirSync } from "fs";

import db, { connectDB, client } from "./src/shared/MongoConnection";
import { startServer } from "./src/server";
import { Server } from "http";

const g = global as unknown as { app?: Server };

beforeAll(async () => {
    await connectDB();

    if (!existsSync("./logs")){ // Create folders for logs
        mkdirSync("./logs");
    }

    if (g.app) return;
    g.app = await startServer("1234", true);
});

afterEach(async () => { // Clear database between test
    const collections = await db.listCollections().toArray();
    await Promise.all(collections.map(async collection => {
        await db.collection(collection.name).deleteMany({});
    }))
});

afterAll(async () => {
    client.close();
    g.app?.close();
});