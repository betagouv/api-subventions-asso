import { Controller, Get, Query, Route, Security, Tags } from 'tsoa';
import statsService from '../../stats.service';

@Route("stats")
@Security("jwt", ['admin'])
@Tags("Stats Controller")
export  class StatsController extends Controller {
    /**
     * 
     * @param start Timestamp starting date for the period
     * @param end Timestamp ending date for the period
     * @param nbReq Number minimal number of requests that user must have done in the defined period
     * @param {string?} includesAdmin true if we include admin in stats, false for exlude admin (default: false)
     * @returns 
     */
    @Get("/requests")
    async getNbUsersByRequestsOnPeriod(@Query() start: string, @Query() end: string, @Query() nbReq: string, @Query() includesAdmin = "false"): Promise<{ success: boolean, data?: number, message?: string }> {
        try {
            const result = await statsService.getNbUsersByRequestsOnPeriod(new Date(start), new Date(end), Number(nbReq), includesAdmin === "true");
            return { success: true, data: result }
        } catch (e) {
            this.setStatus(500);
            return { success: false, message: (e as Error).message}
        }
    }
}