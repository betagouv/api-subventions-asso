import { ObjectId } from "mongodb";
import HistoryUniteLegalImportEntity from "../../../entities/HistoryUniteLegalImportEntity";
import UniteLegalImportDbo from "./UniteLegalImportDbo";

export default class UniteLegalImportAdapter {
    static toEntity(dbo: UniteLegalImportDbo): HistoryUniteLegalImportEntity {
        return new HistoryUniteLegalImportEntity(
            dbo.filename,
            dbo.dateOfFile,
            dbo.dateOfImport,
            dbo._id.toString()
        )
    }

    static toDbo(entity: HistoryUniteLegalImportEntity): UniteLegalImportDbo {
        return {
            filename: entity.filename,
            dateOfFile: entity.dateOfFile,
            dateOfImport: entity.dateOfImport,
            _id: new ObjectId(entity.id)
        }
    }
}