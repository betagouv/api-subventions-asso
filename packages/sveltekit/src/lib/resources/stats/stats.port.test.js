import axios from "axios";
import statsPort from "./stats.port";

describe("StatsPort", () => {
    describe("getTopAssociations", () => {
        let axiosGetMock;

        beforeAll(() => {
            axiosGetMock = vi.spyOn(axios, "get");
        });

        afterAll(() => {
            axiosGetMock.mockRestore();
        });

        it("should return data", async () => {
            const expected = [{ ATD: 1 }, { TOTO: 2 }];

            axiosGetMock.mockImplementationOnce(async () => ({ data: { data: expected } }));

            const actual = await statsPort.getTopAssociations();
            expect(actual).toEqual(expected);
        });
    });

    describe("getMonthlyUserCount", () => {
        let spyAxios;
        const YEAR = 2022;
        const AXIOS_DATA = {
            nombres_utilisateurs_avant_annee: 42,
            evolution_nombres_utilisateurs: [43, 44],
        };
        beforeAll(() => (spyAxios = vi.spyOn(axios, "get").mockResolvedValue({ data: { data: AXIOS_DATA } })));
        afterAll(() => spyAxios.mockRestore());

        it("should call axios with proper path", async () => {
            const path = `/stats/users/monthly/2022`;
            await statsPort.getMonthlyUserCount(YEAR);
            expect(spyAxios).toHaveBeenCalledWith(path);
        });

        it("should return formatted data from axios result", async () => {
            const expected = AXIOS_DATA;
            const actual = await statsPort.getMonthlyUserCount(YEAR);
            expect(actual).toEqual(expected);
        });
    });

    describe("getMonthlyRequestCount", () => {
        let spyAxios;
        const YEAR = 2022;
        const AXIOS_DATA = {
            nb_requetes_par_mois: [43, 44],
            nb_requetes_moyen: 4.8,
            somme_nb_requetes: 90,
        };
        beforeAll(() => (spyAxios = vi.spyOn(axios, "get").mockResolvedValue({ data: AXIOS_DATA })));
        afterAll(() => spyAxios.mockRestore());

        it("should call axios with proper path", async () => {
            const path = `/stats/requests/monthly/2022`;
            await statsPort.getMonthlyRequestCount(YEAR);
            expect(spyAxios).toHaveBeenCalledWith(path);
        });

        it("should return formatted data from axios result", async () => {
            const expected = AXIOS_DATA;
            const actual = await statsPort.getMonthlyRequestCount(YEAR);
            expect(actual).toEqual(expected);
        });
    });
});
