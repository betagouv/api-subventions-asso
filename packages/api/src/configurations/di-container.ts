import depositLogAdapter from "../dataProviders/db/deposit-log/deposit-log.adapter";
import { DepositScdlProcessService } from "../modules/deposit-scdl-process/depositScdlProcess.service";
import { DumpService } from "../modules/dump/dump.service";
import { ScdlDepositCronService } from "../modules/deposit-scdl-process/scdl-deposit.cron.service";

export const depositScdlProcessService = new DepositScdlProcessService(depositLogAdapter);
export const scdlDepositCronService = new ScdlDepositCronService(depositLogAdapter);
export const dumpService = new DumpService(depositScdlProcessService);
