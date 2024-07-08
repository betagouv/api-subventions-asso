const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import OsirisRequestAdapter from "./OsirisRequestAdapter";
import OsirisEntity from "../../../../../tests/modules/providers/osiris/__fixtures__/entity";

jest.mock("../../providers.adapter", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true, // this property makes it work
}));

describe("OsirisRequestAdapter", () => {
    describe("toDemandeSubvention()", () => {
        it("should return a DemandeSubvention", () => {
            const actual = OsirisRequestAdapter.toDemandeSubvention(OsirisEntity);
            expect(actual).toMatchSnapshot();
        });

        it("should set versementKey to undefined if no EJ", () => {
            const entity = JSON.parse(JSON.stringify(OsirisEntity));
            entity.providerInformations.ej = undefined;
            const actual = OsirisRequestAdapter.toDemandeSubvention(entity);
            expect(actual).toMatchSnapshot();
        });

        it("generates status translator", () => {
            const PROVIDER_STATUS = "toto";
            OsirisRequestAdapter.toDemandeSubvention({
                ...OsirisEntity,
                // @ts-expect-error: mock
                providerInformations: { status: PROVIDER_STATUS },
            });
            expect(mockToStatus).toBeCalledWith(PROVIDER_STATUS);
        });

        it("uses status translator", () => {
            const PROVIDER_STATUS = "toto";
            const res = OsirisRequestAdapter.toDemandeSubvention({
                ...OsirisEntity,
                // @ts-expect-error: mock
                providerInformations: { status: PROVIDER_STATUS },
            });
            const actual = res?.statut_label?.value;
            expect(actual).toBe(mockLabel);
        });
    });

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };
        let mockToDemandeSubvention: jest.SpyInstance;

        beforeAll(() => {
            mockToDemandeSubvention = jest.spyOn(OsirisRequestAdapter, "toDemandeSubvention");
            mockToDemandeSubvention.mockReturnValue(APPLICATION);
        });

        afterAll(() => {
            mockToDemandeSubvention.mockRestore();
        });

        it("should call toDemandeSubvention", () => {
            OsirisRequestAdapter.rawToApplication(RAW_APPLICATION);
            expect(mockToDemandeSubvention).toHaveBeenCalledWith(APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            const expected = APPLICATION;
            const actual = OsirisRequestAdapter.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = {
                providerInformations: {
                    dispositif: "DISPOSITIF",
                    extractYear: 2023,
                    montantsAccorde: 42,
                    montantsDemande: 43,
                    service_instructeur: "INSTRUCTEUR",
                    status: "NATIVE_STATUS",
                },
                legalInformations: { siret: "123456789" },
                actions: [
                    {
                        indexedInformations: { intitule: "ACTION 1" },
                    },
                    {
                        indexedInformations: { intitule: "ACTION 2" },
                    },
                ],
            };
            // @ts-expect-error mock
            const actual = OsirisRequestAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });
});
