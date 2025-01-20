import { ObjectId } from "mongodb";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import PaymentFlatDbo from "./PaymentFlatDbo";

export default class PaymentsFlatAdapter {
    static toDbo(entity: PaymentFlatEntity): PaymentFlatDbo {
        return {
            _id: new ObjectId(),
            typeIdEntrepriseBeneficiaire: entity.typeIdEntrepriseBeneficiaire,
            idEntrepriseBeneficiaire: entity.idEntrepriseBeneficiaire.value,
            typeIdEtablissementBeneficiaire: entity.typeIdEtablissementBeneficiaire,
            idEtablissementBeneficiaire: entity.idEtablissementBeneficiaire.value,
            uniqueId: entity.uniqueId,
            idVersement: entity.idVersement,
            exerciceBudgetaire: entity.exerciceBudgetaire,
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
            activite: entity.activityLabel,
            codeCentreFinancier: entity.centreFinancierCode,
            libelleCentreFinancier: entity.centreFinancierLibelle,
            attachementComptable: entity.attachementComptable,
            regionAttachementComptable: entity.regionAttachementComptable,
        };
    }
}
