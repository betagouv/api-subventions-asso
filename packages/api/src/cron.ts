import { ToadScheduler } from "toad-scheduler";
import { CronController } from "./@types/cron";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- test purposes
import { ExampleInterfaceCron } from "./interfaces/cron/_ExampleInterfaceCron";
import { DemarchesSimplifieesInterfaceCron } from "./interfaces/cron/DemarchesSimplifieesInterfaceCron";
import { DauphinInterfaceCron } from "./interfaces/cron/DauphinInterfaceCron";
import { DumpInterfaceCron } from "./interfaces/cron/DumpInterfaceCron";
import { HistoryUniteLegalInterfaceCron } from "./interfaces/cron/HistoryUniteLegalInterfaceCron";

const controllers: CronController[] = [
    // ExampleInterfaceCron,
    DemarchesSimplifieesInterfaceCron,
    DauphinInterfaceCron,
    DumpInterfaceCron,
    HistoryUniteLegalInterfaceCron,
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
