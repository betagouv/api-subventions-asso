import statsService from "../../../src/modules/stats/stats.service";
import statsRepository from '../../../src/modules/stats/repositories/statsRepository';

jest.spyOn(statsRepository, "countUsersByRequestNbOnPeriod");

describe("StatsService", () => {

    describe("getNbUsersByRequestsOnPeriod()", () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (statsRepository.countUsersByRequestNbOnPeriod as jest.Mock).mockImplementationOnce((start, end, minReq) => '7');
        const TODAY = new Date();
        const NB_REQUESTS = 5;
        const START = new Date(TODAY);
        START.setDate(START.getDate() + -1);
        const END = new Date(TODAY);
        END.setDate(END.getDate() + 1);
        it("parse dates to winston value", async () => {
            const expected = [START, END, NB_REQUESTS];
            const actual = statsRepository.countUsersByRequestNbOnPeriod;
            await statsService.getNbUsersByRequestsOnPeriod(START, END, NB_REQUESTS);
            expect(actual).toHaveBeenCalledWith(...expected);
        })
    })
})