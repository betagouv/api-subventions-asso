import MigrationRepository from "../../../../shared/MigrationRepository";
import HistoryImportEntity from "../entities/HistoryImportEntity";

export class HistoryImportRepository extends MigrationRepository<HistoryImportEntity> {
    public collectionName = "datagouv-history-import";

    add(entity: HistoryImportEntity) {
        return this.collection.insertOne(entity);
    }

    findLastImport() {
        return this.collection.find().sort({ dateOfFile: -1 }).tryNext();
    }
}

const historyImportRepository = new HistoryImportRepository();

export default historyImportRepository;