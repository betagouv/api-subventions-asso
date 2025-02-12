import type { AmountsVsProgramRegionDto } from "dto";
import dataVizService from "$lib/resources/dataViz/dataViz.service";

export class DataVizController {
    amountsVsProgramRegionDataPromise: Promise<AmountsVsProgramRegionDto[]>;

    constructor() {
        this.amountsVsProgramRegionDataPromise = dataVizService.getAmountsVsProgramRegion();
    }
}
