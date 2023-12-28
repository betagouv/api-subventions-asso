import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProvidersInfos from "./entities/ProvidersInfos";
import providerService from "./provider.service";

jest.mock("../../../../src/modules/providers/index", () => ({
    __esModule: true, // this property makes it work
    default: {
        serviceA: {
            provider: {
                name: "serviceA",
                type: ProviderEnum.raw,
                description: "descriptionA",
            },
        },
        serviceB: {
            provider: {
                name: "serviceB",
                type: ProviderEnum.api,
                description: "descriptionB",
            },
        },
        serviceC: {
            provider: {
                name: "serviceC",
                type: ProviderEnum.raw,
                description: "descriptionC",
            },
        },
    },
}));

import providers from "../../providers/index";

describe("ProviderService", () => {
    describe("getProvidersInfos()", () => {
        it("should return an ProvidersInfos array", async () => {
            const expected = new ProvidersInfos(
                [
                    {
                        name: providers.serviceB.provider.name,
                        description: providers.serviceB.provider.description,
                    },
                ],
                [
                    {
                        name: providers.serviceA.provider.name,
                        description: providers.serviceA.provider.description,
                    },
                    {
                        name: providers.serviceC.provider.name,
                        description: providers.serviceC.provider.description,
                    },
                ],
            );
            const actual = await providerService.getProvidersInfos();
            expect(actual).toEqual(expected);
        });
    });
});
