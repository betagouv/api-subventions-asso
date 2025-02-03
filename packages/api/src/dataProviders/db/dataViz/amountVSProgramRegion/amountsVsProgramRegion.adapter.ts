import { ObjectId } from "mongodb";
import { AmountsVsProgramRegionDbo } from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.dbo";
import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";

export default class AmountsVsProgrammeRegionAdapter {
    static toDbo(entity: AmountsVsProgramRegionEntity): AmountsVsProgramRegionDbo {
        return {
            _id: new ObjectId(),
            ...entity,
        };
    }
}
