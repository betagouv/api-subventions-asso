import { ENV } from "../../configurations/env.conf";
import configurationsService from "../configurations/configurations.service";
import statsService from "../stats/stats.service";
import userCrudService from "../user/services/crud/user.crud.service";
import metabaseDumpPort from "../../dataProviders/db/dump/metabase-dump.port";
import depositScdlProcessService from "../deposit-scdl-process/depositScdlProcess.service";

export class DumpService {
    // Dump logs, stats tables
    async publishStatsData() {
        if (ENV != "prod") return;

        await metabaseDumpPort.connectToDumpDatabase();

        const lastExecution = await configurationsService.getLastPublishDumpDate();
        await metabaseDumpPort.cleanAfterDate(lastExecution); // ensures not to duplicate logs. should usually do nothing
        const now = new Date();
        const lastLogsCursor = statsService.getAnonymizedLogsOnPeriod(lastExecution, now);
        const batch: unknown[] = [];
        while (await lastLogsCursor.hasNext()) {
            const log = await lastLogsCursor.next();
            batch.push(log);

            if (batch.length > 1000) {
                console.log("Inject batch of 1000 logs");
                await metabaseDumpPort.addLogs(batch);
                batch.length = 0;
            }
        }

        if (batch.length) {
            console.log("Inject batch of " + batch.length + " logs");
            await metabaseDumpPort.addLogs(batch);
            batch.length = 0;
        }

        const lastAssociationVisits = await statsService.getAssociationsVisitsOnPeriod(lastExecution, now);

        console.log("visits: ", lastAssociationVisits.length);

        if (lastAssociationVisits.length) await metabaseDumpPort.addVisits(lastAssociationVisits);

        const users = await userCrudService.find();
        console.log("users: ", users.length);

        if (users.length) {
            await metabaseDumpPort.upsertUsers(users);
            await this.patchWithPipedriveData();
        }

        const depositLogs = await depositScdlProcessService.find();
        console.log("depositLogs: ", depositLogs.length);

        if (depositLogs.length) {
            await metabaseDumpPort.upsertDepositLogs(depositLogs);
        }

        await configurationsService.setLastPublishDumpDate(now);
    }

    importPipedriveData(data) {
        return metabaseDumpPort.savePipedrive(data);
    }

    private patchWithPipedriveData() {
        return metabaseDumpPort.patchWithPipedriveData();
    }
}

const dumpService = new DumpService();

export default dumpService;
