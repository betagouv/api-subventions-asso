import providersPort from "./providers.port";
import providersService from "./providers.service";

describe("providersService", () => {
    describe("getProviders", () => {
        let portGetProvidersMock;

        beforeAll(() => {
            portGetProvidersMock = jest.spyOn(providersPort, "getProviders");
        });

        afterAll(() => {
            portGetProvidersMock.mockRestore();
        });

        it("should return providers", async () => {
            const expected = [{ provider: 1 }, { provider: 2 }];
            portGetProvidersMock.mockImplementationOnce(() => expected);

            const actual = await providersService.getProviders();

            expect(actual).toBe(expected);
        });
    });
});
