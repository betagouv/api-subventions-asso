import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/CronController";
import { DemarchesSimplifieesCron } from "./adapters/inputs/cron/demarches-simplifiees.cron";
import { DumpCron } from "./adapters/inputs/cron/dump.cron";
import { DEV } from "./configurations/env.conf";
import { RgpdCron } from "./adapters/inputs/cron/rgpd.cron";
import { StatsCron } from "./adapters/inputs/cron/stats.cron";
import { SearchCacheCron } from "./adapters/inputs/cron/search-cache.cron";
import { SireneStockUniteLegaleCron } from "./adapters/inputs/cron/sirene-stock-unite-legale.cron";
import { ScdlDepositCron } from "./adapters/inputs/cron/scdl-deposit.cron";

const controllers: CronController[] = [
    // ExampleCron,
    DemarchesSimplifieesCron,
    // DauphinCron, // disabled because we lost access
    DumpCron,
    SireneStockUniteLegaleCron,
    RgpdCron,
    SearchCacheCron,
    StatsCron,
    ScdlDepositCron,
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
