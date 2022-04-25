import request from "supertest";
import statsService from '../../../../../src/modules/stats/stats.service';
import getAdminToken from '../../../../__helpers__/getAdminToken';

const g = global as unknown as { app: unknown };

describe("StatsController", () => {
    jest.spyOn(statsService, "getNbUsersByRequestsOnPeriod");

    describe("getUserRequestsByPeriod", () => {
        const TODAY = new Date();
        const YESTERDAY = (new Date(TODAY)).setDate(TODAY.getDate() + 1);
        const MIN_REQUESTS = "10";

        it("should return data with HTTP status code 200", async () => {
            const DATA = ["Here", "some", "data"];
            (statsService.getNbUsersByRequestsOnPeriod as jest.Mock).mockImplementationOnce(async () => Promise.resolve(DATA));
            const expected = { success: true, data: DATA};
            const actual = await request(g.app)
                .get("/stats/requests")
                .query({ nbReq: MIN_REQUESTS, start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json');
            expect(actual.statusCode).toEqual(200);
            expect(actual.body).toEqual(expected);
        });

        it("should return error with HTTP status code 500", async () => {
            const ERROR_MESSAGE = "Something went wrong";
            (statsService.getNbUsersByRequestsOnPeriod as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { success: false, message: ERROR_MESSAGE };
            const actual = await request(g.app)
                .get("/stats/requests")
                .query({ nbReq: MIN_REQUESTS, start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getAdminToken())
                .set('Accept', 'application/json');
            
            expect(actual.statusCode).toBe(500);
            expect(actual.body).toEqual(expected);
        })
    })
})