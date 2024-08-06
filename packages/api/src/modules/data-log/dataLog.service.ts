import path from "path";
import dataLogRepository from "./repositories/dataLog.repository";

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
}

const dataLogService = new DataLogService();
export default dataLogService;
