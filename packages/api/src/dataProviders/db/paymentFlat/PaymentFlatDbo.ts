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
    idEtablissementBeneficiaire: idEtablissementType<typeIdEtablissement>;
    typeIdEntrepriseBeneficiaire: typeIdEntreprise;
    idEntrepriseBeneficiaire: idEntrepriseType<typeIdEntreprise>;
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
