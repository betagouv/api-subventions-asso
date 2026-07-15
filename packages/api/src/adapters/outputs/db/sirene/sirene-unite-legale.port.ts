import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siren from "../../../../identifier-objects/Siren";

export interface SireneUniteLegalePort {
    createIndexes(): Promise<void>;

    upsertMany(entities: SireneUniteLegaleEntity[]): Promise<void>;
    insertOne(entity: SireneUniteLegaleEntity): Promise<void>;
    updateOne(entity: SireneUniteLegaleEntity): Promise<void>;
    findAll(): Promise<SireneUniteLegaleEntity[]>;
    findOneBySiren(siren: Siren): Promise<SireneUniteLegaleEntity | null>;
    filterExistingSirens(sirens: string[]): Promise<string[]>;
    collectionIsNotEmpty(): Promise<boolean>;
    findOneByRna(rna: Rna): Promise<SireneUniteLegaleEntity | null>;
    deleteAll(): Promise<void>;
}
