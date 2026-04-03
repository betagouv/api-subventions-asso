import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import { AmountsVsProgramRegionDbo } from "./@types/AmountsVsProgramRegionDbo";
import AmountsVsProgramRegionEntity from "./entities/AmountsVsProgramRegionEntity";

export default class AmountsVsProgramRegionMapper {
    static toNotAggregatedEntity(paymentFlatEntity: PaymentFlatEntity): AmountsVsProgramRegionEntity {
        return {
            exerciceBudgetaire: paymentFlatEntity.budgetaryYear,
            regionAttachementComptable: paymentFlatEntity.accountingAttachmentRegion ?? "code region inconnu",
            programme: paymentFlatEntity.programName
                ? String(paymentFlatEntity.programNumber).concat(" - ", paymentFlatEntity.programName)
                : String(paymentFlatEntity.programNumber),
            mission: paymentFlatEntity.mission,
            montant: paymentFlatEntity.amount,
        };
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
