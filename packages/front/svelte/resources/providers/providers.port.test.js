import providersPort from "./providers.port";
import requestsService from "@services/requests.service";

jest.mock("@services/requests.service");

describe("ProvidersPort", () => {
    describe("getProviders", () => {
        it("should return providers", async () => {
            const expected = [{ provider: 1 }, { provider: 2 }];

            requestsService.get.mockImplementationOnce(async () => ({ data: expected }));

            const actual = await providersPort.getProviders();

            expect(actual).toEqual(expected);
        });
    });
});
