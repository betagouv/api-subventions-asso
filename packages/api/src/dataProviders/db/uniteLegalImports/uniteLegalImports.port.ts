import HistoryUniteLegalImportEntity from "../../../entities/HistoryUniteLegalImportEntity";
import MongoPort from "../../../shared/MongoPort";
import UniteLegalImportAdapter from "./UniteLegalImport.adapter";
import UniteLegalImportDbo from "./UniteLegalImportDbo";

export class UniteLegalImportsPort extends MongoPort<UniteLegalImportDbo> {
    public collectionName = "unite-legal-imports";

    async createIndexes() {
        // No indexes
    }

    async insert(entity: HistoryUniteLegalImportEntity): Promise<boolean> {
        try {
            await this.collection.insertOne(UniteLegalImportAdapter.toDbo(entity));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async findLastImport() {
        const dbo = await this.collection.find().sort({ dateOfFile: -1 }).tryNext();

        if (!dbo) return null;

        return UniteLegalImportAdapter.toEntity(dbo);
    }
}

const uniteLegalImportsPort = new UniteLegalImportsPort();

export default uniteLegalImportsPort;
