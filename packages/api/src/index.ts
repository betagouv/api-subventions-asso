import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: `.env.local`, override: true }); //https://stackoverflow.com/a/74622497

import { connectDB } from "./shared/MongoConnection";
import { startServer } from "./server";

async function main() {
    await connectDB();
    await startServer();
}

main();
