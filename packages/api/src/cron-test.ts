// used to manually test cron task

import { NotificationType } from "./modules/notify/@types/NotificationType";
import notifyService from "./modules/notify/notify.service";
import { connectDB } from "./shared/MongoConnection";
import { initIndexes } from "./shared/MongoInit";

async function main() {
    await connectDB();
    await initIndexes();

    await notifyService.notify(NotificationType.BATCH_DEPOSIT_RESUME, { emails: ["foo.bar@beta.gouv.fr"] });
}

main();
