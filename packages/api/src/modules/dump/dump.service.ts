import { ENV } from "../../configurations/env.conf";
import configurationsService from "../configurations/configurations.service";
import statsService from "../stats/stats.service";
import userCrudService from "../user/services/crud/user.crud.service";
import metabaseDumpAdapter from "../../adapters/outputs/db/dump/metabase-dump.adapter";
import dataLogService from "../data-log/dataLog.service";
import { DepositScdlProcessService } from "../deposit-scdl-process/deposit-scdl-process.service";
import { WinstonLog } from "../../@types/WinstonLog";

export class DumpService {
    constructor(private readonly depositScdlProcessService: DepositScdlProcessService) {}

    // Dump logs, stats tables
    async publishStatsData() {
        if (ENV != "prod") return;

        await metabaseDumpAdapter.connectToDumpDatabase();

        const lastExecution = await configurationsService.getLastPublishDumpDate();
        await metabaseDumpAdapter.cleanAfterDate(lastExecution); // ensures not to duplicate logs. should usually do nothing
        const now = new Date();
        const lastLogs = await statsService.getAnonymizedLogsOnPeriod(lastExecution, now);
        const batch: WinstonLog[] = [];

        for (const log of lastLogs) {
            batch.push(log);

            if (batch.length > 1000) {
                console.log("Inject batch of 1000 logs");
                await metabaseDumpAdapter.addLogs(batch);
                batch.length = 0;
            }
        }

        if (batch.length) {
            console.log("Inject batch of " + batch.length + " logs");
            await metabaseDumpAdapter.addLogs(batch);
            batch.length = 0;
        }

        const lastAssociationVisits = await statsService.getAssociationsVisitsOnPeriod(lastExecution, now);

        console.log("visits: ", lastAssociationVisits.length);

        if (lastAssociationVisits.length) await metabaseDumpAdapter.addVisits(lastAssociationVisits);

        const users = await userCrudService.find();
        console.log("users: ", users.length);

        if (users.length) {
            await metabaseDumpAdapter.upsertUsers(users);
            await this.patchWithPipedriveData();
        }

        const depositLogs = await this.depositScdlProcessService.findAll();

        if (depositLogs.length) {
            await metabaseDumpAdapter.upsertDepositLogs(depositLogs);
        }

        const dataLogCursor = dataLogService.findAllCursor();
        // upsert for the moment because datalog structure still changing
        await metabaseDumpAdapter.upsertDataLog(dataLogCursor);

        await configurationsService.setLastPublishDumpDate(now);
    }

    importPipedriveData(data) {
        return metabaseDumpAdapter.savePipedrive(data);
    }

    private patchWithPipedriveData() {
        return metabaseDumpAdapter.patchWithPipedriveData();
    }
}
