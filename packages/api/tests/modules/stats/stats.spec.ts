import request from "supertest";
import statsService from "../../../src/modules/stats/stats.service";
import getAdminToken from "../../__helpers__/getAdminToken";
import getUserToken from "../../__helpers__/getUserToken";
import UserDbo from "../../../src/modules/user/repositories/dbo/UserDbo";
import userFixture from "../user/__fixtures__/entity";
import db from "../../../src/shared/MongoConnection";

const g = global as unknown as { app: unknown };

describe("/stats", () => {
    const spyGetNbUsersByRequestsOnPeriod = jest.spyOn(statsService, "getNbUsersByRequestsOnPeriod");

    describe("/requests", () => {
        const TODAY = new Date();
        const YESTERDAY = new Date(TODAY).setDate(TODAY.getDate() + 1);
        const MIN_REQUESTS = "10";

        it("should return data with HTTP status code 200", async () => {
            const DATA = 5;
            spyGetNbUsersByRequestsOnPeriod.mockImplementationOnce(async () => DATA);
            const expected = { success: true, data: DATA };
            const actual = await request(g.app)
                .get("/stats/requests")
                .query({ nbReq: MIN_REQUESTS, start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");
            expect(actual.statusCode).toEqual(200);
            expect(actual.body).toEqual(expected);
        });

        it("should return error with HTTP status code 500", async () => {
            const ERROR_MESSAGE = "Something went wrong";
            spyGetNbUsersByRequestsOnPeriod.mockImplementationOnce(async () =>
                Promise.reject(new Error(ERROR_MESSAGE))
            );
            const expected = { success: false, message: ERROR_MESSAGE };
            const actual = await request(g.app)
                .get("/stats/requests")
                .query({ nbReq: MIN_REQUESTS, start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");

            expect(actual.statusCode).toBe(500);
            expect(actual.body).toEqual(expected);
        });

        it("should return error with HTTP status code 401", async () => {
            const ERROR_MESSAGE = "Something went wrong";
            spyGetNbUsersByRequestsOnPeriod.mockImplementationOnce(async () =>
                Promise.reject(new Error(ERROR_MESSAGE))
            );
            const expected = { success: false, message: "JWT does not contain required scope." };
            const actual = await request(g.app)
                .get("/stats/requests")
                .query({ nbReq: MIN_REQUESTS, start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json");

            expect(actual.statusCode).toBe(401);
            expect(actual.body).toEqual(expected);
        });
    });

    describe("getMedianRequestOnPeriod", () => {
        const TODAY = new Date();
        const YESTERDAY = new Date(TODAY).setDate(TODAY.getDate() + 1);
        const spyGetMedianRequestsOnPeriod = jest.spyOn(statsService, "getMedianRequestsOnPeriod");

        it("should return data with HTTP status code 200", async () => {
            const DATA = 2;
            spyGetMedianRequestsOnPeriod.mockImplementationOnce(async () => DATA);
            const expected = { success: true, data: DATA };
            const actual = await request(g.app)
                .get("/stats/requests/median")
                .query({ start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");
            expect(actual.statusCode).toEqual(200);
            expect(actual.body).toEqual(expected);
        });

        it("should return error with HTTP status code 500", async () => {
            const ERROR_MESSAGE = "Something went wrong";
            spyGetMedianRequestsOnPeriod.mockImplementationOnce(async () => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { success: false, message: ERROR_MESSAGE };
            const actual = await request(g.app)
                .get("/stats/requests/median")
                .query({ start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json");

            expect(actual.statusCode).toBe(500);
            expect(actual.body).toEqual(expected);
        });

        it("should return error with HTTP status code 401", async () => {
            const ERROR_MESSAGE = "Something went wrong";
            spyGetMedianRequestsOnPeriod.mockImplementationOnce(async () => Promise.reject(new Error(ERROR_MESSAGE)));
            const expected = { success: false, message: "JWT does not contain required scope." };
            const actual = await request(g.app)
                .get("/stats/requests/median")
                .query({ start: YESTERDAY.toString(), end: TODAY.toString() })
                .set("x-access-token", await getUserToken())
                .set("Accept", "application/json")
                .expect(401, expected);
        });
    });

    describe("getCumulatedUsersPerMonthByYear", () => {
        const YEAR = 2022;
        const collection = db.collection<UserDbo>("users");
        beforeEach(() => {
            collection.insertMany(userFixture);
        });

        it("should return data with HTTP status code 200", async () => {
            const DATA = {
                January: 1,
                February: 1,
                March: 1,
                April: 2,
                May: 2,
                June: 2,
                July: 2,
                August: 2,
                September: 2,
                October: 2,
                November: 3,
                December: 3
            };
            const expected = { success: true, data: DATA };
            const actual = await request(g.app)
                .get(`/stats/users/monthly/${YEAR}`)
                .set("x-access-token", await getAdminToken())
                .set("Accept", "application/json")
                .expect(200, expected);
        });
    });
});
