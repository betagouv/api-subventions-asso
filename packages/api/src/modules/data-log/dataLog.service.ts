import path from "path";
import { DataLogDto } from "dto";
import dataLogPort from "../../dataProviders/db/data-log/dataLog.port";
import { DataLogAdapter } from "./dataLog.adapter";

class DataLogService {
    addLog(providerId: string, filePath?: string, editionDate: Date | undefined = undefined, userId?: string) {
        let fileName = filePath;
        if (fileName) {
            const realPath = path.parse(fileName);
            fileName = realPath?.base;
        }

        return dataLogPort.insert({
            providerId,
            integrationDate: new Date(),
            editionDate: editionDate || undefined,
            fileName,
            userId,
        });
    }

    async getProvidersLogOverview(): Promise<DataLogDto[]> {
        const overviews = await dataLogPort.getProvidersLogOverview();
        return overviews.map(overview => DataLogAdapter.overviewToDto(overview));
    }
}

const dataLogService = new DataLogService();
export default dataLogService;
