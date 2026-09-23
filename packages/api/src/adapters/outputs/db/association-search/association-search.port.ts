import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";
import type { AssociationSearchPostalCodes } from "../sirene/sirene-establishment.port";

export interface AssociationSearchPort {
    createIndexes(): Promise<void>;

    findByText(text: string, postalCode?: string): Promise<AssociationSearchEntity[]>;
    findOneBySiren(siren: Siren, postalCode?: string): Promise<AssociationSearchEntity | null>;
    upsertMany(entities: Partial<AssociationSearchDbo>[]): Promise<void>;
    updatePostalCodesBySirens(entities: AssociationSearchPostalCodes[]): Promise<void>;
}
