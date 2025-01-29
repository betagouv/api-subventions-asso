import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import amountsVsProgrammeRegionEntity from "./entitiyAndDbo/amountsVsProgramRegion.entity";

export default class AmountsVsProgrammeRegionAdapter {
    static toNotAggregatedEntity(paymentFlatEntity: PaymentFlatEntity): amountsVsProgrammeRegionEntity {
        const amountsVsProgrammeRegionEntity = {
            exerciceBudgetaire: paymentFlatEntity.exerciceBudgetaire,
            regionAttachementComptable: paymentFlatEntity.regionAttachementComptable
                ? paymentFlatEntity.regionAttachementComptable
                : "Non renseigné",
            programme: paymentFlatEntity.programName
                ? String(paymentFlatEntity.programNumber).concat(" - ", paymentFlatEntity.programName)
                : String(paymentFlatEntity.programNumber),
            mission: paymentFlatEntity.mission,
            amount: paymentFlatEntity.amount,
        };
        return amountsVsProgrammeRegionEntity;
    }
}
