// used to manually test cron task

import rnaCron from "./adapters/inputs/cron/rna.cron";
import { connectDB } from "./shared/MongoConnection";
import { initIndexes } from "./shared/MongoInit";

async function main() {
    await connectDB();
    await initIndexes();
    await rnaCron.import();
}

main();
