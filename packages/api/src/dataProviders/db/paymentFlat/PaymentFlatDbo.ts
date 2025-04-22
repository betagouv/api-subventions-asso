import { ObjectId } from "mongodb";
import { companyIdName, establishmentIdName } from "../../../valueObjects/typeIdentifier";

export default interface PaymentFlatDbo {
    _id: ObjectId;
    uniqueId: string;
    idVersement: string;
    exerciceBudgetaire: number;
    typeIdEtablissementBeneficiaire: establishmentIdName;
    idEtablissementBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: companyIdName;
    idEntrepriseBeneficiaire: string;
    montant: number;
    dateOperation: Date;
    codeCentreFinancier: string | "N/A";
    libelleCentreFinancier: string | "N/A" | null;
    attachementComptable: string | "N/A";
    regionAttachementComptable: string | "N/A" | "code region inconnu";
    // TODO: invetiguate and make it mandatory
    ej: string | null;
    programme: string | null;
    numeroProgramme: number;
    mission: string | null;
    ministere: string | null;
    sigleMinistere: string | null;
    // nullable since #3142 with the add of FonjepPaymentFlat
    codeAction: string | null;
    action: string | null;
    codeActivite: string | null;
    activite: string | null;
    provider: string;
}
