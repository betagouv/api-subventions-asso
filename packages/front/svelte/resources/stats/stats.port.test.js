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
});
