import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siren from "../../../../identifier-objects/Siren";
import { SireneUniteLegaleDbo } from "./SireneUniteLegaleDbo";

export interface SireneUniteLegalePort {
    createIndexes(): Promise<void>;

    upsertMany(entities: SireneUniteLegaleDbo[]): Promise<void>;
    findAll(): Promise<SireneUniteLegaleEntity[]>;
    findOneBySiren(siren: Siren): Promise<SireneUniteLegaleEntity | null>;
    filterExistingSirens(sirens: string[]): Promise<string[]>;
    findOneByRna(rna: Rna): Promise<SireneUniteLegaleEntity | null>;
    deleteAll(): Promise<void>;
}
