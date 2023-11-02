import "reflect-metadata";
import "./configurations/env.conf";

import { connectDB } from "./shared/MongoConnection";
import { initIndexes } from "./shared/MongoInit";
import { startServer } from "./server";

async function main() {
    await connectDB();
    await initIndexes();
    await startServer();
}

main();
