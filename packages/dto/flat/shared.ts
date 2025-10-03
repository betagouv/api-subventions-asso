export type NOT_APPLICABLE = "N/A";

// could be refactored from packages/api/src/identifierObjects/@types/IdentifierName.ts
export type CompanyIdName = "siren" | "rid" | "tahiti";
export type EstablishmentIdName = "siret" | "ridet" | "tahitiet";
export type IdentifierIdName = CompanyIdName | EstablishmentIdName;
