import path from "path";
import { DataLogDto } from "dto";
import dataLogPort from "../../dataProviders/db/data-log/dataLog.port";
import { DataLogAdapter } from "./dataLog.adapter";
import { NewDataLogEntity } from "./entities/dataLogEntity";

class DataLogService {
    throwMissingProp(propName: string) {
        throw new Error(`DataLogEntity must have a ${propName}.`);
    }

    addFromFile(log: NewDataLogEntity) {
        if (!log.fileName) throw new Error("DataLogEntity from file must have a fileName");
        return this.add({ ...log, fileName: path.parse(log.fileName).base });
    }

    addFromApi(log: NewDataLogEntity) {
        if (log.fileName) throw new Error("DataLogEntity from API can't have a fileName");
        return this.add(log);
    }

    add(log: NewDataLogEntity) {
        if (!log.providerId) this.throwMissingProp("providerId");
        if (!log.providerName) this.throwMissingProp("providerName");

        return dataLogPort.insert({ ...log, integrationDate: new Date() });
    }

    async getProvidersLogOverview(): Promise<DataLogDto[]> {
        const overviews = await dataLogPort.getProvidersLogOverview();
        return overviews.map(overview => DataLogAdapter.overviewToDto(overview));
    }
}

const dataLogService = new DataLogService();
export default dataLogService;
