import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import OsirisRequestAdapter from "./OsirisRequestAdapter";
import OsirisEntity from "../../../../../tests/modules/providers/osiris/__fixtures__/entity";

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
    });
});
