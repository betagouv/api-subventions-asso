// used to manually test cron task

import sireneStockCron from "./adapters/inputs/cron/sirene-stock.cron";
import { connectDB } from "./shared/MongoConnection";
import { initIndexes } from "./shared/MongoInit";

async function main() {
    await connectDB();
    await initIndexes();
    await sireneStockCron.importEstablishments();
}

main();
