import * as ProvidersHelper from "./providers.helper";
import { applicationProvidersFixtures } from "./__fixtures__/providers.fixture";

describe("Providers Helper", () => {
    describe("providersById", () => {
        it("should return providers by id", () => {
            const actual = ProvidersHelper.providersById(applicationProvidersFixtures);
            expect(actual).toMatchSnapshot();
        });
    });
});
