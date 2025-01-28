import { Controller, Get, Route, Security, Response, Tags } from "tsoa";
// il devrait être dans "dto" : comment on fait ça ?
import { GetMontantsVsProgrammeRegionResponseDto } from "../../../dto/dataViz/GetMontantsVsProgrammeRegionDto";
import { HttpErrorInterface } from "../../../shared/errors/httpErrors/HttpError";

import amountsVsProgrammeRegionService from "../../../modules/dataViz/amountsVsProgrammeRegion/amountsVsProgrammeRegion.service";

// ici je dois mettre plutôt /dataviz/amount-vs-programme-region ?
@Route("montant-vs-programme-region")
@Security("jwt")
@Tags("dv-montantVsProgrammeRegion Controller")
export class AmountsVsProgrammeRegionHttp extends Controller {
    /**
     * Get information about dv-montantVsProgrammeRegion collection
     * No parameters
     */

    @Get("/")
    @Response<HttpErrorInterface>("404")
    public async getAmountsVsProgrammeRegion(): Promise<GetMontantsVsProgrammeRegionResponseDto> {
        const montantVsProgrammeRegionData = await amountsVsProgrammeRegionService.getAmountsVsProgrammeRegion();
        return { montantVsProgrammeRegionData };
    }
}
