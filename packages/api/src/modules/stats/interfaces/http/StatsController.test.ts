import statsService from "../../stats.service";
import { StatsController } from "./StatsController";

const controller = new StatsController();

describe("StatsController", () => {
    describe("getRequestsPerMonthByYear", () => {
        const getStatSpy = jest.spyOn(statsService, "getRequestsPerMonthByYear");
        const YEAR_STR = "2022";
        const YEAR_NB = 2022;
        const mockedValue = {
            January: 201,
            February: 21,
            March: 20,
            April: 201,
            May: 13,
            June: 201,
            July: 201,
            August: 15,
            September: 201,
            October: 300,
            November: 201,
            December: 1
        };

        it("should call service with args default", async () => {
            getStatSpy.mockImplementationOnce(jest.fn());
            await controller.getRequestsPerMonthByYear(YEAR_STR);
            expect(getStatSpy).toHaveBeenCalledWith(YEAR_NB, false);
        });

        it("should call service with args with includeAdmin", async () => {
            getStatSpy.mockImplementationOnce(jest.fn());
            await controller.getRequestsPerMonthByYear(YEAR_STR, "true");
            expect(getStatSpy).toHaveBeenCalledWith(YEAR_NB, true);
        });

        it("should return a success object", async () => {
            getStatSpy.mockResolvedValueOnce(mockedValue);
            const expected = { success: true, data: mockedValue };
            const actual = await controller.getRequestsPerMonthByYear(YEAR_STR);
            expect(actual).toStrictEqual(expected);
        });

        it("should return an an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getStatSpy.mockRejectedValueOnce(new Error(ERROR_MESSAGE));
            const expected = { success: false, message: ERROR_MESSAGE };
            const actual = await controller.getRequestsPerMonthByYear("blabla");
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("getTopAssociations", () => {
        const getStatSpy = jest.spyOn(statsService, "getTopAssociations");
        const NB_LIMIT_STR = "5";
        const NB_LIMIT_INT = 5;
        const mockedValue = [
            { name: "Asso 1", nbRequests: 42 },
            { name: "Asso 2", nbRequests: 41 },
            { name: "Asso 3", nbRequests: 40 },
            { name: "Asso 4", nbRequests: 39 },
            { name: "Asso 5", nbRequests: 38 }
        ];

        it("should call with args default", async () => {
            getStatSpy.mockImplementationOnce(jest.fn());
            await controller.getTopAssociations(NB_LIMIT_STR);
            expect(getStatSpy).toHaveBeenCalledWith(NB_LIMIT_INT);
        });

        it("should return a success object", async () => {
            getStatSpy.mockResolvedValueOnce(mockedValue);
            const expected = { success: true, data: mockedValue };
            const actual = await controller.getTopAssociations(NB_LIMIT_STR);
            expect(actual).toStrictEqual(expected);
        });

        it("should return an an error object", async () => {
            const ERROR_MESSAGE = "Error";
            getStatSpy.mockRejectedValueOnce(new Error(ERROR_MESSAGE));
            const expected = { success: false, message: ERROR_MESSAGE };
            const actual = await controller.getTopAssociations("blabla");
            expect(actual).toStrictEqual(expected);
        });
    });
});
