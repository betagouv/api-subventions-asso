import axios from "axios";
import statsPort from "./stats.port";

describe("StatsPort", () => {
    describe("getTopAssociations", () => {
        let axiosGetMock;

        beforeAll(() => {
            axiosGetMock = jest.spyOn(axios, "get");
        });

        afterAll(() => {
            axiosGetMock.mockRestore();
        });

        it("should return data", async () => {
            const expected = [{ ATD: 1 }, { TOTO: 2 }];

            axiosGetMock.mockImplementationOnce(async () => ({ data: { success: true, data: expected } }));

            const actual = await statsPort.getTopAssociations();
            expect(actual).toEqual(expected);
        });
    });


    describe("getMonthlyUserCount", () => {
        const spyAxios = jest.spyOn(axios, "get");
        const YEAR = 2022;
        const AXIOS_DATA = {};
        beforeAll(() => spyAxios.mockReturnValue({ data: { data: AXIOS_DATA } }));
        afterAll(() => spyAxios.mockRestore());

        it("should call axios with proper path", async () => {
            const path = `/stats/users/monthly/2022`;
            await statsPort.getMonthlyUserCount(YEAR);
            expect(spyAxios).toHaveBeenCalledWith(path);
        });

        it("should return data from axios result", async () => {
            const expected = AXIOS_DATA;
            const actual = await statsPort.getMonthlyUserCount(YEAR);
            expect(actual).toBe(expected);
        });
    });
});
