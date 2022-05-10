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
     * @returns 
     */
    @Get("/requests")
    async getNbUsersByRequestsOnPeriod(@Query() start: string, @Query() end: string, @Query() nbReq: string): Promise<{ success: boolean, data?: number, message?: string}> {
        let result;
        try {
            result = await statsService.getNbUsersByRequestsOnPeriod(new Date(start), new Date(end), Number(nbReq));
            return { success: true, data: result }
        } catch (e) {
            this.setStatus(500);
            return { success: false, message: (e as Error).message}
        }
    }
}