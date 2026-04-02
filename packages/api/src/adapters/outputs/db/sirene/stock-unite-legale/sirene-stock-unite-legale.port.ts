import { SireneStockUniteLegaleEntity } from "../../../../../entities//SireneStockUniteLegaleEntity";
import Siren from "../../../../../identifierObjects/Siren";

export interface SireneStockUniteLegalePort {
    createIndexes(): Promise<void>;

    upsertMany(entities: SireneStockUniteLegaleEntity[]): Promise<void>;
    insertOne(entity: SireneStockUniteLegaleEntity): Promise<void>;
    updateOne(entity: SireneStockUniteLegaleEntity): Promise<void>;
    findAll(): Promise<SireneStockUniteLegaleEntity[]>;
    findOneBySiren(siren: Siren): Promise<SireneStockUniteLegaleEntity | null>;
    deleteAll(): Promise<void>;
}
