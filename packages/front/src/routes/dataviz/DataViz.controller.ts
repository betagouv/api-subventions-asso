import type { AmountsVsProgramRegionDto } from "dto";
import dataVizService from "$lib/resources/dataViz/dataViz.service";

export class DataVizController {

    amountsVsProgramRegionData: Promise<AmountsVsProgramRegionDto[] | undefined>;

    constructor() {

        this.amountsVsProgramRegionData = dataVizService.getAmountsVsProgramRegion();

    }
}