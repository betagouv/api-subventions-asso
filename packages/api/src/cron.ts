import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/cron";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- test purposes
import { ExampleCronController } from "./modules/example/interfaces/cron/example.cron.controller";

const controllers: CronController[] = [
    // ExampleCronController
];

const scheduler = new ToadScheduler();

export function initCron() {
    for (const controllerClass of controllers) {
        // @ts-expect-error generic type
        const controller = new controllerClass();
        for (const job of controller["__intervalJobs__"] || []) {
            scheduler.addIntervalJob(job);
        }
        for (const job of controller["__cronJobs__"] || []) {
            scheduler.addCronJob(job);
        }
    }
}
