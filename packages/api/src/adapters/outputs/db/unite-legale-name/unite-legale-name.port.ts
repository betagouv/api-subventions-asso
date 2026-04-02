import UniteLegalNameEntity from "../../../../entities//UniteLegalNameEntity";
import Siren from "../../../../identifierObjects/Siren";

export interface UniteLegalNamePort {
    createIndexes(): Promise<void>;

    search(searchQuery: string): Promise<UniteLegalNameEntity[]>;
    findOneBySiren(siren: Siren): Promise<UniteLegalNameEntity | null>;
    upsert(entity: UniteLegalNameEntity): Promise<void>;
    upsertMany(entities: UniteLegalNameEntity[]): Promise<void>;
}
