import path from "path";
import { DataLogDto } from "dto";
import dataLogRepository from "./repositories/dataLog.repository";
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

    async findLastByProvider(): Promise<DataLogDto[]> {
        const logs = await dataLogRepository.findLastByProvider();
        return logs.map(log => DataLogAdapter.entityToDto(log));
    }
}

const dataLogService = new DataLogService();
export default dataLogService;
