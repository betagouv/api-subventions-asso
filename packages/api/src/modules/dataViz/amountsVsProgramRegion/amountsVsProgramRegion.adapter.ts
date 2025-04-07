import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import { AmountsVsProgramRegionDbo } from "./entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "./entitiyAndDbo/amountsVsProgramRegion.entity";

export default class AmountsVsProgramRegionAdapter {
    static toNotAggregatedEntity(paymentFlatEntity: PaymentFlatEntity): AmountsVsProgramRegionEntity {
        const amountsVsProgramRegionEntity = {
            exerciceBudgetaire: paymentFlatEntity.exerciceBudgetaire,
            regionAttachementComptable: paymentFlatEntity.regionAttachementComptable,
            programme: paymentFlatEntity.programName
                ? String(paymentFlatEntity.programNumber).concat(" - ", paymentFlatEntity.programName)
                : String(paymentFlatEntity.programNumber),
            mission: paymentFlatEntity.mission,
            montant: paymentFlatEntity.amount,
        };
        return amountsVsProgramRegionEntity;
    }

    static toDbo(entity: AmountsVsProgramRegionEntity): Omit<AmountsVsProgramRegionDbo, "_id"> {
        return {
            ...entity,
        };
    }

    static toEntity(dbo: AmountsVsProgramRegionDbo): AmountsVsProgramRegionEntity {
        return {
            exerciceBudgetaire: dbo.exerciceBudgetaire,
            montant: dbo.montant,
            programme: dbo.programme,
            regionAttachementComptable: dbo.regionAttachementComptable,
            mission: dbo.mission,
        };
    }
}
