import FonjepEntityAdapter from "./FonjepEntityAdapter";
import { SubventionEntity, PaymentEntity } from "../../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";

describe("FonjepEntityAdapter", () => {
    beforeAll(() => jest.useFakeTimers().setSystemTime(new Date("2022-01-01")));

    describe("toDemandeSubvention()", () => {
        const buildProviderValueAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValueAdapter");
        it("should return a DemandeSubvention", () => {
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value);
            const actual = FonjepEntityAdapter.toDemandeSubvention(SubventionEntity);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toPayment()", () => {
        const buildProviderValueAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValueAdapter");
        it("should return a Payment", () => {
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value);
            const actual = FonjepEntityAdapter.toPayment(PaymentEntity);
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

    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = {
                indexedInformations: {
                    date_versement: new Date("2022-02-02"),
                    dispositif: "DISPOSITIF",
                    annee_demande: 2023,
                    montant_paye: 42,
                    service_instructeur: "INSTRUCTEUR",
                },
                legalInformations: { siret: "123456789" },
                data: { MontantSubvention: 43 },
            };
            const actual = FonjepEntityAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });
});
