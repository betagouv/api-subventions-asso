import { StatsRequestDtoNegativeResponse, StatsRequestDtoResponse, StatsRequestsMedianDtoResponse } from '@api-subventions-asso/dto';
import { Controller, Get, Query, Route, Security, Tags, Response } from 'tsoa';
import statsService from '../../stats.service';

@Route("stats")
@Security("jwt", ['admin'])
@Tags("Stats Controller")
export  class StatsController extends Controller {
    /**
     * Permet de récupérer le nombre d'utilisateurs qui ont fait plus de X requêtes sur une période données
     * 
     * @param start Timestamp starting date for the period
     * @param end Timestamp ending date for the period
     * @param nbReq Number minimal number of requests that user must have done in the defined period
     * @param {string=} [includesAdmin = "false"] true if we include admin in stats, false for exlude admin (All value other of "true" will be considered as false)
     * @returns {StatsRequestDtoResponse}
     */
    @Get("/requests")
    @Response<StatsRequestDtoNegativeResponse>(500, "Error", {
        success: false,
        message: "An Error message",
    })
    async getNbUsersByRequestsOnPeriod(
        @Query() start: string,
        @Query() end: string,
        @Query() nbReq: string,
        @Query() includesAdmin = "false"
    ): Promise<StatsRequestDtoResponse> {
        try {
            const result = await statsService.getNbUsersByRequestsOnPeriod(new Date(start), new Date(end), Number(nbReq), includesAdmin === "true");
            return { success: true, data: result }
        } catch (e) {
            this.setStatus(500);
            return { success: false, message: (e as Error).message}
        }
    }

    /**
     * Permet de récupérer le nombre médian de requêtes sur un période donné
     * 
     * @param start Timestamp starting date for the period
     * @param end Timestamp ending date for the period
     * @param {string=} [includesAdmin = "false"] true if we include admin in stats, false for exlude admin (All value other of "true" will be considered as false)
     * @returns 
     */
    @Get("/requests/median")
    async getMedianRequestOnPeriod(
        @Query() start: string,
        @Query() end: string,
        @Query() includesAdmin = "false"
    ): Promise<StatsRequestsMedianDtoResponse> {
        try {
            const result = await statsService.getMedianRequestsOnPeriod(new Date(start), new Date(end), includesAdmin === "true");
            return { success: true, data: result }
        } catch (e) {
            this.setStatus(500);
            return { success: false, message: (e as Error).message }
        }
    }
}