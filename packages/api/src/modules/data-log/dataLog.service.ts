import { DataLogEntity } from "./entities/dataLogEntity";
import dataLogRepository from "./repositories/dataLog.repository";

class DataLogService {
    addLog(providerId: string, editionDate: Date, fileName?: string) {
        return dataLogRepository.insert({
            providerId,
            integrationDate: new Date(),
            editionDate,
            fileName,
        });
    }
}

const dataLogService = new DataLogService();
export default dataLogService;
