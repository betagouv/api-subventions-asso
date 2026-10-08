import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import {
    EstablishmentAssociationSearch,
    RnaAssociationSearch,
    UniteLegaleAssociationSearch,
} from "./@types/AssociationSearchDbo";
import { Rna } from "../../../../identifier-objects";

export interface AssociationSearchPort {
    createIndexes(): Promise<void>;

    findByText(text: string, postalCode?: string): Promise<AssociationSearchEntity[]>;
    findByIdentifier(identifier: Siren | Rna, postalCode?: string): Promise<AssociationSearchEntity | null>;
    upsertFromEstablishment(entities: EstablishmentAssociationSearch[]): Promise<void>;
    upsertFromSirene(entities: UniteLegaleAssociationSearch[]): Promise<void>;
    upsertFromRna(entities: RnaAssociationSearch[]): Promise<void>;
}
