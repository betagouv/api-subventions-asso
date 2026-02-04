import { CompanyIdName, EstablishmentIdName } from "dto";
import { ObjectId } from "mongodb";

export interface FlatDbo {
    _id: ObjectId;
    idUnique: string;
    fournisseur: string;
    idEtablissementBeneficiaire: string;
    typeIdEtablissementBeneficiaire: EstablishmentIdName;
    idEntrepriseBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: CompanyIdName;
    dateMiseAJour: Date;
}
