import { CompanyIdName, EstablishmentIdName } from "dto";

export interface FlatDbo {
    dateMiseAJour: Date;
    idEtablissementBeneficiaire: string; // Identifiant de l'établissement de l'association qui demande la subvention
    typeIdEtablissementBeneficiaire: EstablishmentIdName; // type identifiant de l'idBeneficiaire entre siret, ridet tahitiet
    idEntrepriseBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: CompanyIdName;
    fournisseur: string; // Service fournisseur de la donnée
}
