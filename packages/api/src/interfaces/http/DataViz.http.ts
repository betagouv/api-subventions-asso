import { Controller, Get, Route, Security, Tags, Response } from "tsoa";
import { GetAmountsVsProgramRegionResponseDto } from "dto";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import amountsVsProgramRegionService from "../../modules/dataViz/amountsVsProgramRegion/amountsVsProgramRegion.service";

@Route("dataviz")
@Security("jwt")
@Tags("Dataviz Controller")
export class DataVizHttp extends Controller {
    @Get("/montant-versus-programme-region")
    @Response<HttpErrorInterface>("404")
    public async getAmountsVsProgramRegion(): Promise<GetAmountsVsProgramRegionResponseDto> {
        const amountsVersusProgramRegionData = await amountsVsProgramRegionService.getAmountsVsProgramRegionData();
        return { amountsVersusProgramRegionData };
    }
}
