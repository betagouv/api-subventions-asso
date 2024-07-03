import "reflect-metadata";
import "./configurations/env.conf";

import { connectDB } from "./shared/MongoConnection";
import { initIndexes } from "./shared/MongoInit";
import { startServer } from "./server";
import { initAsync } from "./shared/initAsync";

async function main() {
    await connectDB();
    await initIndexes();
    await initAsync();
    // coucou
    await startServer();
}

main();
