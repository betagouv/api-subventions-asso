import { ObjectId } from "mongodb";
import { AmountsVsProgramRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";

export default class AmountsVsProgramRegionAdapter {
    static toDbo(entity: AmountsVsProgramRegionEntity): AmountsVsProgramRegionDbo {
        return {
            _id: new ObjectId(),
            ...entity,
        };
    }

    static toEntity(dbo: AmountsVsProgrammeRegionDbo): AmountsVsProgrammeRegionEntity {
        return {
            exerciceBudgetaire: dbo.exerciceBudgetaire,
            montant: dbo.montant,
            programme: dbo.programme,
            regionAttachementComptable: dbo.regionAttachementComptable,
            mission: dbo.mission,
        };
    }
}
