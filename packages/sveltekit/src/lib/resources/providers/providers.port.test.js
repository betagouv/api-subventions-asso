import axios from "axios";
import providersPort from "./providers.port";

describe("ProvidersPort", () => {
    describe("getProviders", () => {
        let axiosGetMock;

        beforeAll(() => {
            axiosGetMock = vi.spyOn(axios, "get");
        });

        afterAll(() => {
            axiosGetMock.mockRestore();
        });

        it("should return providers", async () => {
            const expected = [{ provider: 1 }, { provider: 2 }];

            axiosGetMock.mockImplementationOnce(async () => ({ data: expected }));

            const actual = await providersPort.getProviders();

            expect(actual).toEqual(expected);
        });
    });
});
