import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProvidersInfos from "./entities/ProvidersInfos";
import providerService from "./provider.service";

jest.mock("../../../../src/modules/providers/index", () => ({
    __esModule: true, // this property makes it work
    default: {
        serviceA: {
            meta: {
                name: "serviceA",
                type: ProviderEnum.raw,
                description: "descriptionA",
            },
        },
        serviceB: {
            meta: {
                name: "serviceB",
                type: ProviderEnum.api,
                description: "descriptionB",
            },
        },
        serviceC: {
            meta: {
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
                        name: providers.serviceB.meta.name,
                        description: providers.serviceB.meta.description,
                    },
                ],
                [
                    {
                        name: providers.serviceA.meta.name,
                        description: providers.serviceA.meta.description,
                    },
                    {
                        name: providers.serviceC.meta.name,
                        description: providers.serviceC.meta.description,
                    },
                ],
            );
            const actual = await providerService.getProvidersInfos();
            expect(actual).toEqual(expected);
        });
    });
});
