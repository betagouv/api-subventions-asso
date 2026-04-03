import { ProviderDataDto } from "../shared/ProviderData";

export type NOT_APPLICABLE = "N/A";

// could be refactored from packages/api/src/identifier-objects/@types/IdentifierName.ts
export type CompanyIdName = "siren" | "rid" | "tahiti";
export type EstablishmentIdName = "siret" | "ridet" | "tahitiet";
export type IdentifierIdName = CompanyIdName | EstablishmentIdName;

/** Champs communs à tous les formats plats (ApplicationFlat, PaymentFlat) */
export interface CommonFlatDto extends ProviderDataDto {
    /** Identifiant unique de la ligne dans la base Data Subvention */
    idUnique: string;
    /** Type d'identifiant de l'établissement bénéficiaire */
    typeIdEtablissementBeneficiaire: EstablishmentIdName;
    /** Identifiant de l'établissement bénéficiaire */
    idEtablissementBeneficiaire: string;
    /** Type d'identifiant de l'entreprise bénéficiaire */
    typeIdEntrepriseBeneficiaire: CompanyIdName;
    /** Identifiant de l'entreprise bénéficiaire */
    idEntrepriseBeneficiaire: string;
    /** Nom du fournisseur de données source (ex: "chorus", "fonjep") */
    fournisseur: string;
}
