import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";

export interface AssociationSearchPort {
    createIndexes(): Promise<void>;

    findByText(text: string): Promise<AssociationSearchEntity[]>;
    findOneBySiren(siren: Siren): Promise<AssociationSearchEntity | null>;
    upsertMany(entities: Partial<AssociationSearchDbo>[]): Promise<void>;
}
