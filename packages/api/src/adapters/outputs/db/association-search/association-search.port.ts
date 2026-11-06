import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import {
    ChorusAssociationSearch,
    EstablishmentAssociationSearch,
    RnaAssociationSearch,
    UniteLegaleAssociationSearch,
} from "./@types/AssociationSearchDbo";
import { Rna } from "../../../../identifier-objects";

export interface FindByTextOptions {
    postalCode?: string;
    nameOnly?: boolean;
}

export interface AssociationSearchPort {
    createIndexes(): Promise<void>;

    findByText(text: string, options?: FindByTextOptions): Promise<AssociationSearchEntity[]>;
    findByIdentifier(identifier: Siren | Rna, postalCode?: string): Promise<AssociationSearchEntity | null>;
    upsertFromEstablishment(dbos: EstablishmentAssociationSearch[]): Promise<void>;
    upsertFromSirene(dbos: UniteLegaleAssociationSearch[]): Promise<void>;
    upsertFromRna(dbos: RnaAssociationSearch[]): Promise<void>;
    upsertFromChorus(dbos: ChorusAssociationSearch[]): Promise<void>;
}
