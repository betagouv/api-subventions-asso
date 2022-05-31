import FonjepEntityAdapter from './FonjepEntityAdapter';
import FonjepEntity from "../../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import ProviderValueFactory from '../../../../shared/ProviderValueFactory';


describe("FonjepEntityAdapter", () => {
    describe("toDemandeSubvention()", () => {
        const buildProviderValueAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValueAdapter");
        it("should return a DemandeSubvention", () => {
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value)
            const actual = FonjepEntityAdapter.toDemandeSubvention(FonjepEntity);
            expect(actual).toMatchSnapshot();
        });
        it("should return a DemandeSubvension with co_financeur siret optionnal", () => {
            const entityWithInvalidCoFinanceurSiret = { ...FonjepEntity };
            entityWithInvalidCoFinanceurSiret.indexedInformations.co_financeur_siret = "";
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value)
            const demandeSubvention = FonjepEntityAdapter.toDemandeSubvention(entityWithInvalidCoFinanceurSiret);
            const expected = undefined;
            const actual = demandeSubvention.co_financement?.cofinanceur_siret;
            expect(actual).toEqual(expected);
        });
        it("should return a DemandeSubvention without co_financeur", () => {
            const entityWithoutCoFinanceur = { ...FonjepEntity };
            delete entityWithoutCoFinanceur.indexedInformations.co_financeur;
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value)
            const expected = undefined;
            const actual = FonjepEntityAdapter.toDemandeSubvention(entityWithoutCoFinanceur).co_financement;
            expect(actual).toEqual(expected);
        });
    });
    describe("toEtablissement()", () => {
        const buildProviderValuesAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValuesAdapter");
        it("should return an Etablissement", () => {
            // @ts-expect-error: mock
            buildProviderValuesAdapterMock.mockImplementationOnce(() => value => [value]);
            const actual = FonjepEntityAdapter.toEtablissement(FonjepEntity);
            expect(actual).toMatchSnapshot();
        });
    });
});