import axios from "axios";
import statisticsPort from "./statistics.port";

describe("StatisticsPort", () => {
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

            const actual = await statisticsPort.getTopAssociations();
            expect(actual).toEqual(expected);
        });
    });
});
