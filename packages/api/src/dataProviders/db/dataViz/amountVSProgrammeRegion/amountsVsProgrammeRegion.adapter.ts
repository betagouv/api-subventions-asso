import { ObjectId } from "mongodb";
import { amountsVsProgrammeRegionDbo } from "../../../../modules/dataViz/amountsVsProgrammeRegion/entitiyAndDbo/amountsVsProgrammeRegion.dbo";
import amountsVsProgrammeRegionEntity from "../../../../modules/dataViz/amountsVsProgrammeRegion/entitiyAndDbo/amountsVsProgrammeRegion.entity";

export default class AmountsVsProgrammeRegionAdapter {

    static toDbo(entity: amountsVsProgrammeRegionEntity) : amountsVsProgrammeRegionDbo {
        return {
            _id: new ObjectId(),
            ...entity
        };
    }

}