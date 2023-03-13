import OsirisRequestAdapter from "./OsirisRequestAdapter";
import OsirisEntity from "../../../../../tests/modules/providers/osiris/__fixtures__/entity";

const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

jest.mock("../../helper", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true // this property makes it work
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
                providerInformations: { status: PROVIDER_STATUS }
            });
            expect(mockToStatus).toBeCalledWith(PROVIDER_STATUS);
        });

        it("uses status translator", () => {
            const PROVIDER_STATUS = "toto";
            const res = OsirisRequestAdapter.toDemandeSubvention({
                ...OsirisEntity,
                // @ts-expect-error: mock
                providerInformations: { status: PROVIDER_STATUS }
            });
            const actual = res?.statut_label?.value;
            expect(actual).toBe(mockLabel);
        });
    });
});
