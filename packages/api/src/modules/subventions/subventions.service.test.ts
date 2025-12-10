import subventionsService from "./subventions.service";
import * as providers from "../providers";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Rna from "../../identifierObjects/Rna";
jest.mock("../providers/index");

const DEMANDES_SUBVENTIONS_PROVIDERS = providers.applicationProviders;

const IDENTIFIER = AssociationIdentifier.fromRna(new Rna("W123456789"));

describe("SubventionsService", () => {
    const spy = jest.fn().mockResolvedValue([]);
    beforeEach(() => {
        // @ts-expect-error: mock
        providers.applicationProviders = [
            {
                getApplication: spy,
                provider: {
                    name: "provider",
                },
            },
        ];
    });

    afterEach(() => {
        // @ts-expect-error: mock

        providers.applicationProviders = DEMANDES_SUBVENTIONS_PROVIDERS;
    });

    describe("getDemandes()", () => {
        it("should call getApplication of providers", async () => {
            await subventionsService.getDemandes(IDENTIFIER);
            expect(spy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return subventions", async () => {
            spy.mockResolvedValueOnce([{ id: "1" }]);
            const result = await subventionsService.getDemandes(IDENTIFIER);
            expect(result).toEqual([[{ id: "1" }]]);
        });
    });
});
