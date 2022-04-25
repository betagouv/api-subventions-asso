import * as DateHelper from "../../../src/shared/helpers/DateHelper";
import statsService from "../../../src/modules/stats/stats.service";
import statsRepository from '../../../src/modules/stats/repositories/statsRepository';

jest.spyOn(statsRepository, "countUsersByRequestNbOnPeriod");

describe("StatsService", () => {

    describe("getNbUsersByRequestsOnPeriod()", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (statsRepository.countUsersByRequestNbOnPeriod as jest.Mock).mockImplementationOnce((start, end, minReq) => '7');
        const TODAY = new Date();
        const NB_REQUESTS = '5';
        const START_PERIOD = new Date(TODAY);
        START_PERIOD.setDate(START_PERIOD.getDate() + -1);
        const START = DateHelper.getYMDFromISO(DateHelper.formatTimestamp(START_PERIOD.toISOString()));
        const END_PERIOD = new Date(TODAY);
        END_PERIOD.setDate(END_PERIOD.getDate() + 1);
        const END = DateHelper.getYMDFromISO(DateHelper.formatTimestamp(END_PERIOD.toISOString()));
        it("parse dates to winston value", async () => {
            const expected = [START, END, NB_REQUESTS];
            const actual = statsRepository.countUsersByRequestNbOnPeriod;
            await statsService.getNbUsersByRequestsOnPeriod(START_PERIOD.toISOString(), END_PERIOD.toISOString(), NB_REQUESTS);
            expect(actual).toHaveBeenCalledWith(...expected);
        })
    })
})