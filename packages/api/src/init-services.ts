import depositLogAdapter from "./adapters/outputs/db/deposit-log/deposit-log.adapter";
import { DepositScdlProcessService } from "./modules/deposit-scdl-process/deposit-scdl-process.service";
import { DumpService } from "./modules/dump/dump.service";
import { ScdlDepositCronService } from "./modules/deposit-scdl-process/scdl-deposit.cron.service";
import dataLogAdapter from "./adapters/outputs/db/data-log/data-log.adapter";
import userAdapter from "./adapters/outputs/db/user/user.adapter";
import associationSearchAdapter from "./adapters/outputs/db/association-search/association-search.adapter";

export const depositScdlProcessService = new DepositScdlProcessService(depositLogAdapter, associationSearchAdapter);
export const scdlDepositCronService = new ScdlDepositCronService(depositLogAdapter, dataLogAdapter, userAdapter);
export const dumpService = new DumpService(depositScdlProcessService);
