import { DumpService } from "../modules/dump/dump.service";
import { DepositScdlProcessService } from "../modules/deposit-scdl-process/depositScdlProcess.service";
import depositLogAdapter from "../dataProviders/db/deposit-log/deposit-log.adapter";

export const depositScdlProcessService = new DepositScdlProcessService(depositLogAdapter);
export const dumpService = new DumpService(depositScdlProcessService);
