import path from "path";
import { DataLogDto } from "dto";
import dataLogAdapter from "../../adapters/outputs/db/data-log/data-log.adapter";
import { DataLogMapper } from "./data-log.mapper";
import { ApiDataLogEntity, DataLogEntity, DataLogSource, FileDataLogEntity } from "./entities/dataLogEntity";

export interface DataLogService {
    throwMissingProp(propName: string): void;
    addFromFile(log: Omit<FileDataLogEntity, "source" | "integrationDate">): Promise<void>;
    addFromApi(log: Omit<ApiDataLogEntity, "source" | "integrationDate">): Promise<void>;
    add(log: Omit<FileDataLogEntity, "integrationDate"> | Omit<ApiDataLogEntity, "integrationDate">): Promise<void>;
    getProvidersLogOverview(): Promise<DataLogDto[]>;
    findAllCursor(): AsyncIterable<DataLogEntity>;
}

class DataLogServiceImpl implements DataLogService {
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

        return dataLogAdapter.insert({ ...log, integrationDate: new Date() });
    }

    async getProvidersLogOverview(): Promise<DataLogDto[]> {
        const overviews = await dataLogAdapter.getProvidersLogOverview();
        return overviews.map(overview => DataLogMapper.overviewToDto(overview));
    }

    findAllCursor() {
        return dataLogAdapter.findAllCursor();
    }
}

const dataLogService = new DataLogServiceImpl();
export default dataLogService;
