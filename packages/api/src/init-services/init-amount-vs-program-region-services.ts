import { AmountsVsProgramRegionService } from "../modules/dataViz/amountsVsProgramRegion/amountsVsProgramRegion.service";
import amountsVsProgramRegionAdapter from "../dataProviders/db/dataViz/amountVSProgramRegion/amounts-vs-program-region.adapter";

export const amountsVsProgramRegionService = new AmountsVsProgramRegionService(amountsVsProgramRegionAdapter);
