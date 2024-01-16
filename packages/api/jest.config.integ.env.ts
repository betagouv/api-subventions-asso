/* eslint-disable @typescript-eslint/no-empty-function */

jest.spyOn(console, "info").mockImplementation(() => {});
jest.mock("axios");
jest.mock("./src/configurations/env.conf", () => ({ ENV: "test" }))
jest.mock("@getbrevo/brevo", () => {
    class ContactsApi {
        createContact = jest.fn().mockResolvedValue(true);
        updateContact = jest.fn().mockResolvedValue(true);
        deleteContact = jest.fn().mockResolvedValue(true);
    }
    return {
        TransactionalEmailsApi: jest.fn(),
        SendSmtpEmail: jest.fn(() => ({ templateId: undefined })),
        ApiClient: {
            instance: {
                authentications: {
                    "api-key": {
                        apiKey: undefined,
                    },
                },
            },
        },
        ContactsApi,
    };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
process.env.JWT_SECRET = require("crypto").randomBytes(256).toString("base64");
process.env.BETA_GOUV_DOMAIN = "beta.gouv.fr";

import { existsSync, mkdirSync } from "fs";
import { Server } from "http";

import db, { connectDB, client } from "./src/shared/MongoConnection";
import { initIndexes } from "./src/shared/MongoInit";
import { startServer } from "./src/server";
import { scheduler } from "./src/cron";
import configurationsRepository from "./src/modules/configurations/repositories/configurations.repository";
import { CONFIGURATION_NAMES } from "./src/modules/configurations/configurations.service";

const g = global as unknown as { app?: Server };

const addBetaGouvEmailDomain = async () => {
    await configurationsRepository.upsert(CONFIGURATION_NAMES.ACCEPTED_EMAIL_DOMAINS, {
        data: [process.env.BETA_GOUV_DOMAIN],
    });
};

beforeAll(async () => {
    await connectDB();
    if (!existsSync("./logs")) {
        // Create folders for logs
        mkdirSync("./logs");
    }

    if (g.app) return;
    g.app = await startServer("1234", true);
    await initIndexes();
});

beforeEach(async () => await addBetaGouvEmailDomain());

afterEach(async () => {
    // Clear database between test
    const collections = await db.listCollections().toArray();
    await collections.reduce(async (acc, collection) => {
        await acc;
        await db.collection(collection.name).deleteMany({});

        return Promise.resolve();
    }, Promise.resolve() as Promise<void>);
});

afterAll(async () => {
    await client.close();
    g.app?.close();
    scheduler.stop();
});
