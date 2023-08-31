import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/cron";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- test purposes
import { ExampleCronController } from "./modules/example/interfaces/cron/example.cron.controller";
import { DemarchesSimplifieesCronController } from "./modules/example/interfaces/cron/demarchesSimplifiees.cron.controller";
import { DauphinCronController } from "./modules/providers/dauphin/interfaces/cron/dauphin.cron.controller";
import { DumpCronController } from "./modules/dump/interfaces/cron/DumpCronController";

const controllers: CronController[] = [
    // ExampleCronController,
    DemarchesSimplifieesCronController,
    DauphinCronController,
    DumpCronController,
];

export const scheduler = new ToadScheduler();

export function initCron() {
    for (const ControllerClass of controllers) {
        // @ts-expect-error generic type
        const controller = new ControllerClass();
        for (const job of controller["__intervalJobs__"] || []) {
            scheduler.addIntervalJob(job);
        }
        for (const job of controller["__cronJobs__"] || []) {
            scheduler.addCronJob(job);
        }
    }
}
