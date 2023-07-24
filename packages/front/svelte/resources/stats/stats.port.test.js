import statsPort from "./stats.port";
import requestsService from "@services/requests.service";

jest.mock("@services/requests.service");

describe("StatsPort", () => {
    describe("getTopAssociations", () => {
        it("should return data", async () => {
            const expected = [{ ATD: 1 }, { TOTO: 2 }];

            jest.mocked(requestsService.get).mockImplementationOnce(async () => ({ data: { data: expected } }));

            const actual = await statsPort.getTopAssociations();
            expect(actual).toEqual(expected);
        });
    });

    describe("getMonthlyUserCount", () => {
        const YEAR = 2022;
        const AXIOS_DATA = {
            nombres_utilisateurs_avant_annee: 42,
            evolution_nombres_utilisateurs: [43, 44],
        };
        beforeAll(() => jest.mocked(requestsService.get).mockResolvedValue({ data: { data: AXIOS_DATA } }));
        afterAll(() => jest.mocked(requestsService.get).mockRestore());

        it("should call requestsService with proper path", async () => {
            const path = `/stats/users/monthly/2022`;
            await statsPort.getMonthlyUserCount(YEAR);
            expect(requestsService.get).toHaveBeenCalledWith(path);
        });

        it("should return formatted data from requestsService result", async () => {
            const expected = AXIOS_DATA;
            const actual = await statsPort.getMonthlyUserCount(YEAR);
            expect(actual).toEqual(expected);
        });
    });

    describe("getMonthlyRequestCount", () => {
        const YEAR = 2022;
        const AXIOS_DATA = {
            nb_requetes_par_mois: [43, 44],
            nb_requetes_moyen: 4.8,
            somme_nb_requetes: 90,
        };
        beforeAll(() => jest.mocked(requestsService.get).mockResolvedValue({ data: AXIOS_DATA }));
        afterAll(() => jest.mocked(requestsService.get).mockRestore());

        it("should call requestsService with proper path", async () => {
            const path = `/stats/requests/monthly/2022`;
            await statsPort.getMonthlyRequestCount(YEAR);
            expect(requestsService.get).toHaveBeenCalledWith(path);
        });

        it("should return formatted data from requestsService result", async () => {
            const expected = AXIOS_DATA;
            const actual = await statsPort.getMonthlyRequestCount(YEAR);
            expect(actual).toEqual(expected);
        });
    });
});
