import { Controller, Get, Route, Security, Tags, Response, Example, Hidden } from "tsoa";
import { GetAmountsVsProgramRegionResponseDto } from "dto";
import { HttpErrorInterface } from "core";
import amountsVsProgramRegionService from "../../../modules/dataViz/amountsVsProgramRegion/amountsVsProgramRegion.service";

@Route("dataviz")
@Hidden()
@Security("jwt")
@Tags("Dataviz Controller")
export class DataVizHttp extends Controller {
    /**
     * @summary Montants des subventions agrégés par programme et région
     */
    @Example<GetAmountsVsProgramRegionResponseDto>({
        amountsVersusProgramRegionData: [
            {
                exerciceBudgetaire: 2023,
                montant: 125000,
                programme: "163",
                regionAttachementComptable: "Île-de-France",
                mission: "Sport, jeunesse et vie associative",
            },
        ],
    })
    @Get("/montant-versus-programme-region")
    @Response<HttpErrorInterface>("404")
    public async getAmountsVsProgramRegion(): Promise<GetAmountsVsProgramRegionResponseDto> {
        const amountsVersusProgramRegionData = await amountsVsProgramRegionService.getAmountsVsProgramRegionData();
        return { amountsVersusProgramRegionData };
    }
}
