import uniteLegalImportsPort from "../../../../dataProviders/db/uniteLegalImports/uniteLegalImports.port";
import HistoryUniteLegalImportEntity from "../../../../entities/HistoryUniteLegalImportEntity";

export class UniteLegalImportService {
    addNewImport(entity: HistoryUniteLegalImportEntity) {
        return uniteLegalImportsPort.insert(entity);
    }

    async getLastDateImport() {
        const result = await uniteLegalImportsPort.findLastImport();

        if (!result) return null;

        return result.dateOfFile;
    }
}

const uniteLegalImportService = new UniteLegalImportService();

export default uniteLegalImportService;