import { Controller, Get, Route, Security, Response, Tags } from "tsoa";
// il devrait être dans "dto" : comment on fait ça ?
import { GetMontantsVsProgrammeRegionResponseDto } from "dto";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";

import amountsVsProgrammeRegionService from "../../modules/dataViz/amountsVsProgrammeRegion/amountsVsProgrammeRegion.service";

@Route("dataViz")
@Security("jwt")
@Tags("dv-montantVsProgrammeRegion Controller")
export class AmountsVsProgrammeRegionHttp extends Controller {
    /**
     * Get information about dv-montantVsProgrammeRegion collection
     * No parameters
     */

    @Get("/montant-vs-programme-region")
    @Response<HttpErrorInterface>("404")
    public async getAmountsVsProgrammeRegion(): Promise<GetMontantsVsProgrammeRegionResponseDto> {
        const montantVsProgrammeRegionData = await amountsVsProgrammeRegionService.getAmountsVsProgrammeRegion();
        return { montantVsProgrammeRegionData };
    }
}
