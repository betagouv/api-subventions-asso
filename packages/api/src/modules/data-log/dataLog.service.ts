import path from "path";
import { DataLogDto } from "dto";
import dataLogRepository from "../../dataProviders/db/data-log/dataLog.port";
import { DataLogAdapter } from "./dataLog.adapter";

class DataLogService {
    addLog(providerId: string, editionDate: Date, filePath?: string) {
        let fileName = filePath;
        if (fileName) {
            const realPath = path.parse(fileName);
            fileName = realPath?.base;
        }

        return dataLogRepository.insert({
            providerId,
            integrationDate: new Date(),
            editionDate,
            fileName,
        });
    }

    async getProvidersLogOverview(): Promise<DataLogDto[]> {
        const overviews = await dataLogRepository.getProvidersLogOverview();
        return overviews.map(overview => DataLogAdapter.overviewToDto(overview));
    }
}

const dataLogService = new DataLogService();
export default dataLogService;
