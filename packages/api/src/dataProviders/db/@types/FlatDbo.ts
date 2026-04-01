import { CompanyIdName, EstablishmentIdName } from "dto";
import { ObjectId } from "mongodb";
import { ProviderDataDbo } from "./ProviderDataDbo";

export interface FlatDbo extends ProviderDataDbo {
    _id: ObjectId;
    idUnique: string;
    fournisseur: string;
    idEtablissementBeneficiaire: string;
    typeIdEtablissementBeneficiaire: EstablishmentIdName;
    idEntrepriseBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: CompanyIdName;
}
