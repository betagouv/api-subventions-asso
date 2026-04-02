import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/CronController";
import { DemarchesSimplifieesCron } from "./adapters/inputs/cron/DemarchesSimplifiees.cron";
import { DumpCron } from "./adapters/inputs/cron/Dump.cron";
import { DEV } from "./configurations/env.conf";
import { RgpdCron } from "./adapters/inputs/cron/Rgpd.cron";
import { StatsCron } from "./adapters/inputs/cron/Stats.cron";
import { SearchCacheCron } from "./adapters/inputs/cron/SearchCache.cron";
import { SireneStockUniteLegaleCron } from "./adapters/inputs/cron/SireneStockUniteLegale.cron";

const controllers: CronController[] = [
    // ExampleCron,
    DemarchesSimplifieesCron,
    // DauphinCron, // disabled because we lost access
    DumpCron,
    SireneStockUniteLegaleCron,
    RgpdCron,
    SearchCacheCron,
    StatsCron,
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
