import { Siren, Siret } from "dto";
import { ObjectId } from "mongodb";

export default interface PaymentFlatDbo {
    _id: ObjectId;
    uniqueId: string;
    idVersement: string;
    exerciceBudgetaire: number;
    siret: Siret;
    siren: Siren;
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
