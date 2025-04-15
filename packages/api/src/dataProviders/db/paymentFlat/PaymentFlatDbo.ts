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
    ej: string | null;
    codePoste: string | null;
    programme: string | null;
    numeroProgramme: number;
    mission: string | null;
    ministere: string | null;
    sigleMinistere: string | null;
    codeAction: string;
    action: string | null;
    codeActivite: string | null;
    activite: string | null;
    provider: string;
}
