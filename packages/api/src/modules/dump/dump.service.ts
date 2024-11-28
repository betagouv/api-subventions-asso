import { ENV } from "../../configurations/env.conf";
import configurationsService from "../configurations/configurations.service";
import statsService from "../stats/stats.service";
import userCrudService from "../user/services/crud/user.crud.service";
import metabaseDumpRepo from "../../dataProviders/db/dump/metabase-dump.port";

export class DumpService {
    // Dump logs, stats tables
    async publishStatsData() {
        if (ENV != "prod") return;

        await metabaseDumpRepo.connectToDumpDatabase();

        const lastExecution = await configurationsService.getLastPublishDumpDate();
        const now = new Date();
        const lastLogsCursor = statsService.getAnonymizedLogsOnPeriod(lastExecution, now);
        const batch: unknown[] = [];
        while (await lastLogsCursor.hasNext()) {
            const log = await lastLogsCursor.next();
            batch.push(log);

            if (batch.length > 1000) {
                console.log("Inject batch of 1000 logs");
                await metabaseDumpRepo.addLogs(batch);
                batch.length = 0;
            }
        }

        if (batch.length) {
            console.log("Inject batch of " + batch.length + " logs");
            await metabaseDumpRepo.addLogs(batch);
            batch.length = 0;
        }

        const lastAssociationVisits = await statsService.getAssociationsVisitsOnPeriod(lastExecution, now);

        console.log("visits: ", lastAssociationVisits.length);

        if (lastAssociationVisits.length) await metabaseDumpRepo.addVisits(lastAssociationVisits);

        const users = await userCrudService.find();
        console.log("users: ", users.length);

        if (users.length) {
            await metabaseDumpRepo.upsertUsers(users);
            await this.patchWithPipedriveData();
        }

        await configurationsService.setLastPublishDumpDate(now);
    }

    importPipedriveData(data) {
        return metabaseDumpRepo.savePipedrive(data);
    }

    private patchWithPipedriveData() {
        return metabaseDumpRepo.patchWithPipedriveData();
    }
}

const dumpService = new DumpService();

export default dumpService;
