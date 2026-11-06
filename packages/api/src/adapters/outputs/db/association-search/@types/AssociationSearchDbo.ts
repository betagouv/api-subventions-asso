import { Address } from "../../../../../@types/Address";

type RnaOrSirene =
    | {
          rna?: string;
          sirene: string;
      }
    | {
          rna: string;
          sirene?: string;
      };

export interface AssociationSearchPaymentsDbo {
    total: number;
    min: number;
    max: number;
    nb: number;
}

export default interface AssociationSearchDbo {
    siren?: string;
    mainEstablishmentSiret?: string;
    rna?: string;
    name: RnaOrSirene;
    searchName?: RnaOrSirene; // sanitized names for the search engine
    nameTokens?: string[]; // names (set from rna and sirene name) split in words for the search engine
    object?: string;
    searchObject?: string; // sanitized object for the search engine
    objectTokens?: string[]; // object split in words for the search engine
    address?: Address;
    nbEstabs?: number;
    postalCodes?: string[];
    payments: Record<string, AssociationSearchPaymentsDbo>; // { 2026: AssociationSearchPaymentsDbo }
}

export type EstablishmentAssociationSearch = Required<
    Pick<AssociationSearchDbo, "siren" | "nbEstabs" | "postalCodes">
> &
    Pick<AssociationSearchDbo, "address">;

export type UniteLegaleAssociationSearch = Required<
    Pick<AssociationSearchDbo, "siren" | "mainEstablishmentSiret" | "searchName" | "nameTokens">
> & {
    name: { sirene: string };
} & Pick<AssociationSearchDbo, "rna">;

export type RnaAssociationSearch = Required<Pick<AssociationSearchDbo, "rna" | "searchName" | "nameTokens">> & {
    name: { rna: string };
} & Pick<AssociationSearchDbo, "siren" | "object" | "searchObject" | "objectTokens">;

export type ChorusAssociationSearch = Required<Pick<AssociationSearchDbo, "siren" | "payments">>;
