import {
    StatsRequestDtoResponse,
    StatsRequestsMedianDtoResponse,
    MonthlyAvgRequestDtoResponse
} from "@api-subventions-asso/dto";
import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";
import { Controller, Get, Query, Route, Security, Tags, Response } from "tsoa";
import statsService from "../../stats.service";
import { BadRequestError } from "../../../../shared/errors/httpErrors";

@Route("stats")
@Security("jwt", ["admin"])
@Tags("Stats Controller")
export class StatsController extends Controller {
    /**
     * Permet de récupérer le nombre d'utilisateurs qui ont fait plus de X requêtes sur une période données
     *
     * @summary Permet de récupérer le nombre d'utilisateurs qui ont fait plus de X requêtes sur une période données
     * @param start Timestamp starting date for the period
     * @param end Timestamp ending date for the period
     * @param nbReq Number minimal number of requests that user must have done in the defined period
     * @param {string=} [includesAdmin = "false"] true if we include admin in stats, false for exlude admin (All value other of "true" will be considered as false)
     * @returns {StatsRequestDtoResponse}
     */
    @Get("/requests")
    @Response<ErrorResponse>(500, "Error", {
        success: false,
        message: "An Error message"
    })
    async getNbUsersByRequestsOnPeriod(
        @Query() start: string,
        @Query() end: string,
        @Query() nbReq: string,
        @Query() includesAdmin = "false"
    ): Promise<StatsRequestDtoResponse> {
        const result = await statsService.getNbUsersByRequestsOnPeriod(
            new Date(start),
            new Date(end),
            Number(nbReq),
            includesAdmin === "true"
        );
        return { success: true, data: result };
    }

    /**
     * Permet de récupérer le nombre médian de requêtes sur un période donnée
     *
     * @summary Permet de récupérer le nombre médian de requêtes sur un période donnée
     * @param start Timestamp starting date for the period
     * @param end Timestamp ending date for the period
     * @param {string=} [includesAdmin = "false"] true if we include admin in stats, false for exclude admin (All value other of "true" will be considered as false)
     * @returns
     */
    @Get("/requests/median")
    @Response<ErrorResponse>("500")
    async getMedianRequestOnPeriod(
        @Query() start: string,
        @Query() end: string,
        @Query() includesAdmin = "false"
    ): Promise<StatsRequestsMedianDtoResponse> {
        const result = await statsService.getMedianRequestsOnPeriod(
            new Date(start),
            new Date(end),
            includesAdmin === "true"
        );
        return { success: true, data: result };
    }

    /**
     * Permet de récupérer le nombre total de requêtes sur un période donnée
     *
     * @summary Permet de récupérer le nombre total de requêtes sur un période donnée
     * @param year
     * @param {string=} [includesAdmin = "false"] true to include admin in stats, false for exclude admin (All value other of "true" will be considered as false)
     * @returns
     */
    @Get("/requests/monthly/{year}")
    @Response<ErrorResponse>("500")
    async getRequestsPerMonthByYear(
        year: string,
        @Query() includesAdmin = "false"
    ): Promise<MonthlyAvgRequestDtoResponse> {
        if (isNaN(Number(year))) throw new BadRequestError("'date' must be a number");
        const result = await statsService.getRequestsPerMonthByYear(Number(year), includesAdmin === "true");
        return { success: true, data: result };
    }

    /**
     * Permet de récupérer le nombre d'utilisateurs cumulés par mois pour une année donnée
     *
     * @summary Permet de récupérer le nombre d'utilisateurs cumulés par mois pour une année donnée
     * @param year
     * @returns
     */
    @Get("/users/monthly/{year}")
    @Response<ErrorResponse>("500")
    async getCumulatedUsersPerMonthByYear(year: string): Promise<unknown> {
        if (isNaN(Number(year))) throw new BadRequestError("'date' must be a number");
        const result = await statsService.getMonthlyUserNbByYear(Number(year));
        return { success: true, data: result };
    }
}
