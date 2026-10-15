// used to manually test cron task

// import env.
import "./configurations/env.conf";

import { connectDB } from "./shared/MongoConnection";
import { initIndexes } from "./shared/MongoInit";

async function main() {
    await connectDB();
    await initIndexes();
    // add the cron execution here
}

main();
