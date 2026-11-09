import depositLogAdapter from "./adapters/outputs/db/deposit-log/deposit-log.adapter";
import { DepositScdlProcessService } from "./modules/deposit-scdl-process/deposit-scdl-process.service";
import { MetabaseDumpService } from "./modules/dump/metabase-dump.service";
import { PosthogDumpService } from "./modules/dump/posthog-dump.service";
import { ScdlDepositCronService } from "./modules/deposit-scdl-process/scdl-deposit.cron.service";
import dataLogAdapter from "./adapters/outputs/db/data-log/data-log.adapter";
import userAdapter from "./adapters/outputs/db/user/user.adapter";
import associationSearchAdapter from "./adapters/outputs/db/association-search/association-search.adapter";
import getAssociationName from "./usecases/search/get-association-name";

export const depositScdlProcessService = new DepositScdlProcessService(
    depositLogAdapter,
    associationSearchAdapter,
    getAssociationName,
);
export const scdlDepositCronService = new ScdlDepositCronService(depositLogAdapter, dataLogAdapter, userAdapter);
export const metabaseDumpService = new MetabaseDumpService(depositScdlProcessService);
export const posthogDumpService = new PosthogDumpService();
