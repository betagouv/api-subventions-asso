import "reflect-metadata";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { connectDB } from "./shared/MongoConnection";
import { startServer } from "./server";

async function main() {
    await connectDB();
    await startServer();
}

main();
