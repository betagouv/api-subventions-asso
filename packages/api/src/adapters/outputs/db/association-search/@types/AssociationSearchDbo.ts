import { Address } from "../../../../../@types/Address";

export default interface AssociationSearchDbo {
    siren?: string;
    mainEstablishmentSiret?: string;
    rna?: string;
    name:
        | {
              rna?: string;
              sirene: string;
          }
        | {
              rna: string;
              sirene?: string;
          };
    searchName?: string; // sanitized name for the search engine
    object?: string;
    searchObject?: string; // sanitized object for the search engine
    address?: Address;
    nbEstabs?: number;
    postalCodes?: string[];
}

export type EstablishmentAssociationSearch = Required<
    Pick<AssociationSearchDbo, "siren" | "nbEstabs" | "postalCodes">
> &
    Pick<AssociationSearchDbo, "address">;

export type UniteLegaleAssociationSearch = Required<
    Pick<AssociationSearchDbo, "siren" | "mainEstablishmentSiret" | "searchName">
> & {
    name: { sirene: string };
} & Pick<AssociationSearchDbo, "rna">;

export type RnaAssociationSearch = Required<Pick<AssociationSearchDbo, "rna" | "searchName">> & {
    name: { rna: string };
} & Pick<AssociationSearchDbo, "siren" | "object" | "searchObject">;
