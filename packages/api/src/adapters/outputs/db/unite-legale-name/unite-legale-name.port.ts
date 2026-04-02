import UniteLegaleNameEntity from "../../../../entities/UniteLegaleNameEntity";
import Siren from "../../../../identifierObjects/Siren";

export interface UniteLegalNamePort {
    createIndexes(): Promise<void>;

    search(searchQuery: string): Promise<UniteLegaleNameEntity[]>;
    findOneBySiren(siren: Siren): Promise<UniteLegaleNameEntity | null>;
    upsert(entity: UniteLegaleNameEntity): Promise<void>;
    upsertMany(entities: UniteLegaleNameEntity[]): Promise<void>;
}
