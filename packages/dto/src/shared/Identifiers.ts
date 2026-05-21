export enum UniteLegaleIdentifiers {
    SIREN = "siren",
    RID = "rid",
    TAHITI = "tahiti",
}

export type RNA = "rna";

export type AssociationIdentifiers = UniteLegaleIdentifiers | RNA;

export enum EstablishmentIdentifiers {
    RIDET = "ridet",
    SIRET = "siret",
    TAHITIET = "tahitiet",
}

export type StructureIdentifier = AssociationIdentifiers | EstablishmentIdentifiers;
