import path from "path";
import { DataLogDto } from "dto";
import dataLogPort from "../../dataProviders/db/data-log/dataLog.port";
import { DataLogMapper } from "./data-log.mapper";
import { ApiDataLogEntity, DataLogSource, FileDataLogEntity } from "./entities/dataLogEntity";

class DataLogService {
    throwMissingProp(propName: string) {
        throw new Error(`DataLogEntity must have a ${propName}.`);
    }

    addFromFile(log: Omit<FileDataLogEntity, "source" | "integrationDate">) {
        if (!log.fileName) throw new Error("DataLogEntity from file must have a fileName");
        return this.add({ ...log, fileName: path.parse(log.fileName).base, source: DataLogSource.FILE });
    }

    addFromApi(log: Omit<ApiDataLogEntity, "source" | "integrationDate">) {
        // @ts-expect-error: guard to ensure no fileName is provided
        if (log.fileName) throw new Error("DataLogEntity from API can't have a fileName");
        return this.add({ ...log, source: DataLogSource.API });
    }

    add(log: Omit<FileDataLogEntity, "integrationDate"> | Omit<ApiDataLogEntity, "integrationDate">) {
        if (!log.providerId) this.throwMissingProp("providerId");
        if (!log.providerName) this.throwMissingProp("providerName");

        return dataLogPort.insert({ ...log, integrationDate: new Date() });
    }

    async getProvidersLogOverview(): Promise<DataLogDto[]> {
        const overviews = await dataLogPort.getProvidersLogOverview();
        return overviews.map(overview => DataLogMapper.overviewToDto(overview));
    }

    findAllCursor() {
        return dataLogPort.findAllCursor();
    }
}

const dataLogService = new DataLogService();
export default dataLogService;
