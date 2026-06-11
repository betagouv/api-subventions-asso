import { API_PROVIDER, RAW_PROVIDER } from "./__fixtures__/providers.fixture";
import * as ProvidersHelper from "./providers.helper";

describe("Providers Helper", () => {
    describe("providersById", () => {
        it("should return providers by id", () => {
            const actual = ProvidersHelper.providersById([RAW_PROVIDER, API_PROVIDER]);
            expect(actual).toMatchSnapshot();
        });
    });
});
