import { ObjectId } from "mongodb";
import PaymentFlatEntity from "../../../entities/PaymentsFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";

export default class PaymentsFlatAdapter {
    static toDbo(entity: PaymentFlatEntity): PaymentFlatDbo {
        return {
            _id: new ObjectId(),
            siret: entity.siret,
            siren: entity.siren,
            montant: entity.amount,
            dateOperation: entity.operationDate,
            programme: entity.programName,
            numeroProgramme: entity.programNumber,
            mission: entity.mission,
            ministere: entity.ministry,
            sigleMinistere: entity.ministryAcronym,
            ej: entity.ej,
            provider: entity.provider,
            codeAction: entity.actionCode,
            action: entity.actionLabel,
            codeActivite: entity.activityCode,
            Activite: entity.activityLabel,
        };
    }
}
