import dataVizPort from "./dataViz.port";
import type AmountsVsProgramRegionEntity from "./entities/amountsVsProgramRegion.entity";

class DataVizService {

    async getAmountsVsProgramRegion() {
        const result = await dataVizPort.getAmountsVsProgramRegion();
        if (!result) return;

        return result as AmountsVsProgramRegionEntity;
    }
}

const dataVizService = new DataVizService();

export default dataVizService;