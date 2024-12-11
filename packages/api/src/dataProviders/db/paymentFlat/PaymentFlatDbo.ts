import { ObjectId } from "mongodb";

export default interface PaymentFlatDbo {
    _id: ObjectId;
    typeIdEtablissementBeneficiaire: string;
    idEtablissementBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: string;
    idEntrepriseBeneficiaire: string;
    uniqueId: string;
    idVersement: string;
    exerciceBudgetaire: number;
    montant: number;
    dateOperation: Date;
    programme: string | null;
    numeroProgramme: number;
    mission: string | null;
    ministere: string | null;
    sigleMinistere: string | null;
    ej: string;
    provider: string;
    codeAction: string;
    action: string | null;
    codeActivite: string | null;
    activite: string | null;
}
