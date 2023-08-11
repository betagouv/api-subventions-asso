import "reflect-metadata";
import "./configurations/env";

import { connectDB } from "./shared/MongoConnection";
import { startServer } from "./server";

async function main() {
    await connectDB();
    await startServer();
}

main();
