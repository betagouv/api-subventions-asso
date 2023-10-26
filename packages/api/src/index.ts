import "reflect-metadata";
import "./configurations/env.conf";

import { connectDB, initIndexes } from "./shared/MongoConnection";
import { startServer } from "./server";

async function main() {
    await connectDB();
    await initIndexes();
    await startServer();
}

main();
