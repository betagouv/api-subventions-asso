import statsService from "../../stats.service";
import { StatsController } from "./StatsController";
import { BadRequestError } from "../../../../shared/errors/httpErrors";

const controller = new StatsController();

describe("StatsController", () => {
    const mockGetUsersByStatus = jest.spyOn(statsService, "getUsersByStatus").mockImplementation(jest.fn());

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

        it("should require a number as date", async () => {
            const expected = new BadRequestError("'date' must be a number");
            const test = () => controller.getRequestsPerMonthByYear("not a number");
            await expect(test).rejects.toThrowError(expected);
        });
    });

    describe("getCumulatedUsersPerMonthByYear", () => {
        const getStatSpy = jest.spyOn(statsService, "getMonthlyUserNbByYear");
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
            await controller.getCumulatedUsersPerMonthByYear(YEAR_STR);
            expect(getStatSpy).toHaveBeenCalledWith(YEAR_NB);
        });

        it("should return a success object", async () => {
            getStatSpy.mockResolvedValueOnce(mockedValue);
            const expected = { success: true, data: mockedValue };
            const actual = await controller.getCumulatedUsersPerMonthByYear(YEAR_STR);
            expect(actual).toStrictEqual(expected);
        });

        it("should require a number as date", async () => {
            const expected = new BadRequestError("'date' must be a number");
            const test = () => controller.getCumulatedUsersPerMonthByYear("not a number");
            await expect(test).rejects.toThrowError(expected);
        });
    });

    describe("getUsersByStatus", () => {
        it("should call statsService.getUsersByStatus()", async () => {
            await controller.getUsersByStatus();
            expect(mockGetUsersByStatus).toHaveBeenCalledTimes(1);
        });
    });

    describe("getTopAssociations", () => {
        const serviceSpy = jest.spyOn(statsService, "getTopAssociationsByPeriod");
        const DATA = [
            { name: "MOUVEMENT ATD QUART MONDE", visits: 346 },
            { name: "UNIS CITE", visits: 145 },
            { name: "L'ARCHE DE SIENA", visits: 76 },
            {
                name: "ASSOCIATION DE LA FONDATION ETUDIANTE POUR LA VILLE AFEV",
                visits: 61
            },
            { name: "AURORE (DAWN)", visits: 52 }
        ];

        beforeAll(() => serviceSpy.mockResolvedValue(DATA));
        afterAll(() => serviceSpy.mockRestore());

        it("should throw error if limit is not a number", () => {
            expect(() => controller.getTopAssociations("erztye")).rejects.toThrowError(
                new BadRequestError("'limit' must be a number")
            );
        });

        it("should call service with default args", async () => {
            await controller.getTopAssociations();
            const now = new Date();
            const expected = [
                5,
                new Date(Date.UTC(now.getFullYear() - 1, now.getMonth())),
                new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1))
            ];

            expect(serviceSpy).toBeCalledWith(...expected);
        });

        it("should call service with given formatted args", async () => {
            const start = new Date(Date.UTC(2021, 2));
            const end = new Date(Date.UTC(2022, 2));
            await controller.getTopAssociations(
                "7",
                start.getFullYear().toString(),
                start.getMonth().toString(),
                end.getFullYear().toString(),
                end.getMonth().toString()
            );

            const expected = [7, start, new Date(Date.UTC(2022, 3))];

            expect(serviceSpy).toHaveBeenCalledWith(...expected);
        });

        it("should return formatted service response", async () => {
            const expected = { success: true, data: DATA };
            const actual = await controller.getTopAssociations();
            expect(actual).toEqual(expected);
        });
    });
});
