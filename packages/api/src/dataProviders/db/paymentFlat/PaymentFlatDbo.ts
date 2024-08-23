import { ObjectId } from "mongodb";

export default interface PaymentFlatDbo {
    _id: ObjectId;
    siret: string;
    siren: string;
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
