import FonjepEntityAdapter from './FonjepEntityAdapter';
import { SubventionEntity } from "../../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import ProviderValueFactory from '../../../../shared/ProviderValueFactory';


describe("FonjepEntityAdapter", () => {
    describe("toDemandeSubvention()", () => {
        const buildProviderValueAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValueAdapter");
        it("should return a DemandeSubvention", () => {
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value)
            const actual = FonjepEntityAdapter.toDemandeSubvention(SubventionEntity);
            expect(actual).toMatchSnapshot();
        });
    });
    describe("toEtablissement()", () => {
        const buildProviderValuesAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValuesAdapter");
        it("should return an Etablissement", () => {
            // @ts-expect-error: mock
            buildProviderValuesAdapterMock.mockImplementationOnce(() => value => [value]);
            const actual = FonjepEntityAdapter.toEtablissement(SubventionEntity);
            expect(actual).toMatchSnapshot();
        });
    });
});