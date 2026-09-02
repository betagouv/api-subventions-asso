import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/CronController";
import { DemarchesSimplifieesCron } from "./adapters/inputs/cron/demarches-simplifiees.cron";
import { DumpCron } from "./adapters/inputs/cron/dump.cron";
import { DEV } from "./configurations/env.conf";
import { RgpdCron } from "./adapters/inputs/cron/rgpd.cron";
import { StatsCron } from "./adapters/inputs/cron/stats.cron";
import { SearchCacheCron } from "./adapters/inputs/cron/search-cache.cron";
import sireneStockCron from "./adapters/inputs/cron/sirene-stock.cron";
import { ScdlDepositCron } from "./adapters/inputs/cron/scdl-deposit.cron";
import chorusCron from "./adapters/inputs/cron/chorus.cron";
import rnaCron from "./adapters/inputs/cron/rna.cron";

// @DEPRECATED: do not add any more cron here
const controllers: CronController[] = [
    DemarchesSimplifieesCron,
    DumpCron,
    RgpdCron,
    SearchCacheCron,
    StatsCron,
    ScdlDepositCron,
];

const crons: CronController[] = [
    // quick workarround with the add of dependance injection
    // @TODO: rework CRON orchestration and only import here instances of CRON
    chorusCron,
    sireneStockCron,
    rnaCron,
];

export const scheduler = new ToadScheduler();

const TEST_CRON = false; // override to test cron in dev environment

function addIntervalJob(jobs) {
    jobs.forEach(job => scheduler.addIntervalJob(job));
}

function addCronJob(jobs) {
    jobs.forEach(job => scheduler.addCronJob(job));
}

export function initCron() {
    if (DEV && !TEST_CRON) return;

    // @TODO: refactor this to only use configurated cron (with dependance injection)
    for (const ControllerClass of controllers) {
        // @ts-expect-error generic type
        crons.push(new ControllerClass());
    }

    for (const cron of crons) {
        addIntervalJob(cron["__intervalJobs__"] || []);
        addCronJob(cron["__cronJobs__"] || []);
    }
}
