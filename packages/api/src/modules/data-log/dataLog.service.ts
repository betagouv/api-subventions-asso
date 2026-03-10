import path from "path";
import { DataLogDto } from "dto";
import { DataLogMapper } from "./data-log.mapper";
import { ApiDataLogEntity, DataLogEntity, DataLogSource, FileDataLogEntity } from "./entities/dataLogEntity";
import { DataLogPort } from "../../dataProviders/db/data-log/data-log.port";

export class DataLogService {
    constructor(private readonly dataLogPort: DataLogPort) {}

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

        return this.dataLogPort.insert({ ...log, integrationDate: new Date() });
    }

    async getProvidersLogOverview(): Promise<DataLogDto[]> {
        const overviews = await this.dataLogPort.getProvidersLogOverview();
        return overviews.map(overview => DataLogMapper.overviewToDto(overview));
    }

    findAllCursor(): AsyncIterable<DataLogEntity> {
        return this.dataLogPort.findAllCursor();
    }
}
