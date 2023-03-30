import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/cron";

const controllers: CronController[] = [];

const scheduler = new ToadScheduler();

export function initCron() {
    for (const controllerClass of controllers) {
        // @ts-expect-error generic type
        const controller = new controllerClass();
        for (const job of controller["__jobs__"]) {
            scheduler.addIntervalJob(job);
        }
    }
}
