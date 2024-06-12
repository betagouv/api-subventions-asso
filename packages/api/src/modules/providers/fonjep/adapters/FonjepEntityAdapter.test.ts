import FonjepEntityAdapter from "./FonjepEntityAdapter";
import { SubventionEntity, PaymentEntity } from "../../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import { FONJEP_PAYMENTS, FONJEP_PAYMENT_ENTITIES } from "../__fixtures__/FonjepEntities";
import { RawPayment } from "../../../grant/@types/rawGrant";

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

    describe("rawToPayment", () => {
        // @ts-expect-error: parameter type
        const RAW_PAYMENT: RawPayment = { data: FONJEP_PAYMENT_ENTITIES[0] };
        let mockToPayment: jest.SpyInstance;

        beforeAll(() => {
            mockToPayment = jest.spyOn(FonjepEntityAdapter, "toPayment");
            mockToPayment.mockReturnValue(FONJEP_PAYMENTS[0]);
        });

        afterEach(() => {
            mockToPayment.mockClear();
        });

        afterAll(() => {
            mockToPayment.mockRestore();
        });

        it("should call toPayment", () => {
            FonjepEntityAdapter.rawToPayment(RAW_PAYMENT);
            expect(FonjepEntityAdapter.toPayment).toHaveBeenCalledWith(RAW_PAYMENT.data);
        });

        it("should return Payment", () => {
            const expected = FONJEP_PAYMENTS[0];
            const actual = FonjepEntityAdapter.rawToPayment(RAW_PAYMENT);
            expect(actual).toEqual(expected);
        });
    });

    describe("toPayment()", () => {
        const buildProviderValueAdapterMock = jest.spyOn(ProviderValueFactory, "buildProviderValueAdapter");
        it("should return a Payment", () => {
            // @ts-expect-error: mock
            buildProviderValueAdapterMock.mockImplementationOnce(() => value => value);
            const actual = FonjepEntityAdapter.toPayment(PaymentEntity, {
                code_programme: 0,
                label_programme: "FAKE",
            } as StateBudgetProgramEntity);
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
