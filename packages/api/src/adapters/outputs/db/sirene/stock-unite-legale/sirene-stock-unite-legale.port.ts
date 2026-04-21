import { SireneStockUniteLegaleEntity } from "../../../../../entities//SireneStockUniteLegaleEntity";
import Rna from "../../../../../identifier-objects/Rna";
import Siren from "../../../../../identifier-objects/Siren";

export interface SireneStockUniteLegalePort {
    createIndexes(): Promise<void>;

    upsertMany(entities: SireneStockUniteLegaleEntity[]): Promise<void>;
    insertOne(entity: SireneStockUniteLegaleEntity): Promise<void>;
    updateOne(entity: SireneStockUniteLegaleEntity): Promise<void>;
    findAll(): Promise<SireneStockUniteLegaleEntity[]>;
    findOneBySiren(siren: Siren): Promise<SireneStockUniteLegaleEntity | null>;
    findOneByRna(rna: Rna): Promise<SireneStockUniteLegaleEntity | null>;
    deleteAll(): Promise<void>;
}
