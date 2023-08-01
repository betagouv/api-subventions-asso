import providersPort from "./providers.port";
import requestsService from "$lib/services/requests.service";

vi.mock("$lib/services/requests.service");

describe("ProvidersPort", () => {
    describe("getProviders", () => {
        it("should return providers", async () => {
            const expected = [{ provider: 1 }, { provider: 2 }];

            vi.mocked(requestsService.get).mockImplementationOnce(async () => ({ data: expected }));

            const actual = await providersPort.getProviders();

            expect(actual).toEqual(expected);
        });
    });
});
