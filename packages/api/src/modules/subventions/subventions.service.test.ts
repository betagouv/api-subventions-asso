import subventionsService from "./subventions.service";
import * as providers from "../providers";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import Rna from "../../valueObjects/Rna";
jest.mock("../providers/index");

const DEMANDES_SUBVENTIONS_PROVIDERS = providers.demandesSubventionsProviders;

const IDENTIFIER = AssociationIdentifier.fromRna(new Rna("W123456789"));

describe("SubventionsService", () => {
    const spy = jest.fn().mockResolvedValue([]);
    beforeEach(() => {
        // @ts-expect-error: mock
        providers.demandesSubventionsProviders = [
            {
                getDemandeSubvention: spy,
                provider: {
                    name: "provider",
                },
            },
        ];
    });

    afterEach(() => {
        // @ts-expect-error: mock

        providers.demandesSubventionsProviders = DEMANDES_SUBVENTIONS_PROVIDERS;
    });

    describe("getDemandes()", () => {
        it("should call getDemandeSubvention of providers", async () => {
            await subventionsService.getDemandes(IDENTIFIER).toPromise();
            expect(spy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a flux with subventions", async () => {
            spy.mockResolvedValueOnce([{ id: "1" }]);
            const result = await subventionsService.getDemandes(IDENTIFIER).toPromise();
            expect(result).toEqual([
                {
                    __meta__: {
                        totalProviders: 1,
                    },
                },
                {
                    __meta__: {
                        totalProviders: 1,
                        provider: "provider",
                    },
                    subventions: [{ id: "1" }],
                },
            ]);
        });
    });
});
