import { ObjectId } from "mongodb";
import { amountsVsProgrammeRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import amountsVsProgrammeRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";

export default class AmountsVsProgrammeRegionAdapter {
    static toDbo(entity: amountsVsProgrammeRegionEntity): amountsVsProgrammeRegionDbo {
        return {
            _id: new ObjectId(),
            ...entity,
        };
    }
}
