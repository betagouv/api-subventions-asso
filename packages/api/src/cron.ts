import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/cron";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- test purposes
import { ExampleCron } from "./interfaces/cron/_Example.cron";
import { DemarchesSimplifieesCron } from "./interfaces/cron/DemarchesSimplifiees.cron";
import { DauphinCron } from "./interfaces/cron/Dauphin.cron";
import { DumpCron } from "./interfaces/cron/Dump.cron";
import { HistoryUniteLegalCron } from "./interfaces/cron/HistoryUniteLegal.cron";
import { DEV } from "./configurations/env.conf";
import { RgpdCron } from "./interfaces/cron/Rgpd.cron";

const controllers: CronController[] = [
    // ExampleCron,
    DemarchesSimplifieesCron,
    DauphinCron,
    DumpCron,
    HistoryUniteLegalCron,
    RgpdCron,
];

export const scheduler = new ToadScheduler();

const TEST_CRON = false; // override to test cron in dev environment

export function initCron() {
    if (DEV && !TEST_CRON) return;
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
