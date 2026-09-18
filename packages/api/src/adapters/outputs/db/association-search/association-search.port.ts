import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";

export interface AssociationSearchPort {
    createIndexes(): Promise<void>;

    search(searchQuery: string): Promise<AssociationSearchEntity[]>;
    findOneBySiren(siren: Siren): Promise<AssociationSearchEntity | null>;
    upsertMany(entities: Partial<AssociationSearchEntity>[]): Promise<void>;
}
