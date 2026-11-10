import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import {
    EstablishmentAssociationSearch,
    RnaAssociationSearch,
    UniteLegaleAssociationSearch,
} from "./@types/AssociationSearchDbo";
import { Rna } from "../../../../identifier-objects";
import type { SearchLocation } from "../../../../usecases/search/parse-search-location";

export interface FindByTextOptions {
    location?: SearchLocation;
    nameOnly?: boolean;
}

export interface AssociationSearchPort {
    createIndexes(): Promise<void>;

    findByText(text: string, options?: FindByTextOptions): Promise<AssociationSearchEntity[]>;
    findByIdentifier(identifier: Siren | Rna, location?: SearchLocation): Promise<AssociationSearchEntity | null>;
    upsertFromEstablishment(entities: EstablishmentAssociationSearch[]): Promise<void>;
    upsertFromSirene(entities: UniteLegaleAssociationSearch[]): Promise<void>;
    upsertFromRna(entities: RnaAssociationSearch[]): Promise<void>;
}
