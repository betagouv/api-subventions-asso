import statsService from "../../modules/stats/stats.service";
import { StatsHttp } from "./Stats.http";
import { BadRequestError } from "../../shared/errors/httpErrors";

const controller = new StatsHttp();

describe("StatsHttp", () => {
    const mockGetUserCountByStatus = jest.spyOn(statsService, "getUserCountByStatus").mockImplementation(jest.fn());

    describe("getRequestsPerMonthByYear", () => {
        const getStatSpy = jest.spyOn(statsService, "getRequestsPerMonthByYear");
        const YEAR_STR = "2022";
        const YEAR_NB = 2022;
        const mockedValue = {
            nb_requetes_par_mois: [201, 21, 20, 201, 13, 201, 201, 15, 201, 300, 201, 1],
            nb_requetes_moyen: 12,
            somme_nb_requetes: 12,
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

        it("should return data", async () => {
            getStatSpy.mockResolvedValueOnce(mockedValue);
            const expected = mockedValue;
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
            nombres_utilisateurs_avant_annee: 201,
            evolution_nombres_utilisateurs: [201, 21, 20, 201, 13, 201, 201, 15, 201, 300, 201, 1],
        };

        it("should call service with args default", async () => {
            getStatSpy.mockImplementationOnce(jest.fn());
            await controller.getCumulatedUsersPerMonthByYear(YEAR_STR);
            expect(getStatSpy).toHaveBeenCalledWith(YEAR_NB);
        });

        it("should return data", async () => {
            getStatSpy.mockResolvedValueOnce(mockedValue);
            const expected = { data: mockedValue };
            const actual = await controller.getCumulatedUsersPerMonthByYear(YEAR_STR);
            expect(actual).toStrictEqual(expected);
        });

        it("should require a number as date", async () => {
            const expected = new BadRequestError("'date' must be a number");
            const test = () => controller.getCumulatedUsersPerMonthByYear("not a number");
            await expect(test).rejects.toThrowError(expected);
        });
    });

    describe("getUserCountByStatus", () => {
        const USERS_BY_STATUS = { admin: 0, active: 0, idle: 0, inactive: 0 };

        it("should call statsService.getUserCountByStatus()", async () => {
            await controller.getUserCountByStatus();
            expect(mockGetUserCountByStatus).toHaveBeenCalledTimes(1);
        });

        it("should return data", async () => {
            mockGetUserCountByStatus.mockImplementationOnce(async () => USERS_BY_STATUS);
            const expected = { data: USERS_BY_STATUS };
            const actual = await controller.getUserCountByStatus();
            expect(actual).toEqual(expected);
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
                visits: 61,
            },
            { name: "AURORE (DAWN)", visits: 52 },
        ];

        beforeAll(() => serviceSpy.mockResolvedValue(DATA));
        afterAll(() => serviceSpy.mockRestore());

        it("should throw error if limit is not a number", () => {
            expect(() => controller.getTopAssociations("erztye")).rejects.toThrowError(
                new BadRequestError("'limit' must be a number"),
            );
        });

        it("should call service with default args", async () => {
            await controller.getTopAssociations();
            const now = new Date();
            const expected = [
                5,
                new Date(Date.UTC(now.getFullYear() - 1, now.getMonth())),
                new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1)),
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
                end.getMonth().toString(),
            );

            const expected = [7, start, new Date(Date.UTC(2022, 3))];

            expect(serviceSpy).toHaveBeenCalledWith(...expected);
        });

        it("should return data", async () => {
            const expected = { data: DATA };
            const actual = await controller.getTopAssociations();
            expect(actual).toEqual(expected);
        });
    });

    describe("getExportersEmails", () => {
        const EMAILS = ["a@b.c", "d@e.f"];
        const serviceMock = jest.spyOn(statsService, "getExportersEmails").mockResolvedValue(EMAILS);
        afterAll(() => serviceMock.mockRestore());
        it("calls service", async () => {
            await controller.getExportersEmails();
            expect(serviceMock).toBeCalled();
        });
        it("sends result from service", async () => {
            const expected = { emails: EMAILS };
            const actual = await controller.getExportersEmails();
            expect(actual).toEqual(expected);
        });
    });
});
