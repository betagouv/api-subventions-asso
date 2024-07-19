import { Siren, Siret } from "dto";
import { ObjectId } from "mongodb";

export default interface paymentFlatDbo {
    _id: ObjectId;
    siret: Siret;
    siren: Siren;
    montant: number;
    dateOperation: Date;
    programme: string;
    numeroProgramme: number;
    mission: string;
    ministere: string;
    sigleMinistere: string;
    ej: string;
    provider: string;
    codeAction: string;
    action: string;
    codeActivite: string;
    Activite: string;
}
