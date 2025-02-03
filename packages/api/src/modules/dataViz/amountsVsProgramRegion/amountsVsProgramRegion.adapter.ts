import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import AmountsVsProgramRegionEntity from "./entitiyAndDbo/amountsVsProgramRegion.entity";

export default class AmountsVsProgramRegionAdapter {
    static toNotAggregatedEntity(paymentFlatEntity: PaymentFlatEntity): AmountsVsProgramRegionEntity {
        const amountsVsProgramRegionEntity = {
            exerciceBudgetaire: paymentFlatEntity.exerciceBudgetaire,
            regionAttachementComptable: paymentFlatEntity.regionAttachementComptable
                ? paymentFlatEntity.regionAttachementComptable
                : "Non renseigné",
            programme: paymentFlatEntity.programName
                ? String(paymentFlatEntity.programNumber).concat(" - ", paymentFlatEntity.programName)
                : String(paymentFlatEntity.programNumber),
            mission: paymentFlatEntity.mission,
            montant: paymentFlatEntity.amount,
        };
        return amountsVsProgramRegionEntity;
    }
}
