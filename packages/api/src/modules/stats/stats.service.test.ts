import logsPort from "../../dataProviders/db/stats/stats.port";
import statsAssociationsVisitPort from "../../dataProviders/db/stats/statsAssociationsVisit.port";
import statsService from "./stats.service";
import { FindCursor, ObjectId } from "mongodb";

jest.mock("../../dataProviders/db/stats/statsAssociationsVisit.port");
jest.mock("../../dataProviders/db/stats/stats.port");

describe("StatsService", () => {
    // pass-through methods
    describe.each`
        methodToTest                       | methodToCall                                    | nbArgs
        ${"addAssociationVisit"}           | ${statsAssociationsVisitPort.add}               | ${1}
        ${"getUserLastSearchDate"}         | ${statsAssociationsVisitPort.getLastSearchDate} | ${1}
        ${"getAllVisitsUser"}              | ${statsAssociationsVisitPort.findByUserId}      | ${1}
        ${"getAllLogUser"}                 | ${logsPort.findByEmail}                         | ${1}
        ${"getAssociationsVisitsOnPeriod"} | ${statsAssociationsVisitPort.findOnPeriod}      | ${2}
    `("$methodToTest passes through $methodToCall", ({ methodToTest, methodToCall, nbArgs }) => {
        const ARGS = ["a", "b"].slice(0, nbArgs);
        it("calls methodToCall", async () => {
            await statsService[methodToTest](...ARGS);
            expect(methodToCall).toHaveBeenCalledWith(...ARGS);
        });

        it("returns result from methodToCall", async () => {
            const expected = "TOTO";
            jest.mocked(methodToCall).mockResolvedValue(expected);
            const actual = await statsService[methodToTest](...ARGS);
            expect(actual).toEqual(expected);
        });
    });

    describe("getAnonymizedLogsOnPeriod", () => {
        const ID_STRING = "123456789012345678901234";
        const LOG = {
            meta: {
                req: {
                    body: {
                        email: "toto@email.com",
                        firstName: "Toto",
                        lastName: "Tata",
                        phoneNumber: "0123456789",
                    },
                    user: { _id: ID_STRING },
                },
            },
        };
        const START = new Date("1955-06-22");
        const END = new Date("1985-06-22");

        beforeAll(() => {
            jest.mocked(logsPort.getLogsOnPeriod).mockReturnValue([LOG] as unknown as FindCursor);
        });
        afterAll(() => {
            jest.mocked(logsPort.getLogsOnPeriod).mockRestore();
        });

        it("calls port", () => {
            statsService.getAnonymizedLogsOnPeriod(START, END);
            expect(logsPort.getLogsOnPeriod).toHaveBeenCalledWith(START, END);
        });

        it.each`
            property
            ${"email"}
            ${"firstName"}
            ${"lastName"}
            ${"phoneNumber"}
        `("deletes $arg", ({ property }) => {
            const actual = statsService.getAnonymizedLogsOnPeriod(START, END)[0].meta.req.body[property];
            expect(actual).toBeUndefined();
        });

        it("sets user id as ObjectId", () => {
            const expected = new ObjectId(ID_STRING);
            const actual = statsService.getAnonymizedLogsOnPeriod(START, END)[0].meta.req.userId;
            expect(actual).toEqual(expected);
        });

        it("removes user's properties", () => {
            const actual = statsService.getAnonymizedLogsOnPeriod(START, END)[0].meta.req.user;
            expect(actual).toBeUndefined();
        });
    });
});
