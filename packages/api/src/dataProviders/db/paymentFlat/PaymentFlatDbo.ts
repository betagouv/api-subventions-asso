import { ObjectId } from "mongodb";
import {
    idEntrepriseType,
    idEtablissementType,
    typeIdEntreprise,
    typeIdEtablissement,
} from "../../../valueObjects/typeIdentifier";

export default interface PaymentFlatDbo {
    _id: ObjectId;
    typeIdEtablissementBeneficiaire: typeIdEtablissement;
    idEtablissementBeneficiaire: string;
    typeIdEntrepriseBeneficiaire: typeIdEntreprise;
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
    codeCentreFinancier: string | null;
    libelleCentreFinancier: string | null;
    attachementComptable: string | null;
    regionAttachementComptable: string | null;
}
