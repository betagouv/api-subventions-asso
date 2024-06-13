import FonjepEntityAdapter from "./FonjepEntityAdapter";
import { SubventionEntity, PaymentEntity } from "../../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import { FONJEP_PAYMENTS, FONJEP_PAYMENT_ENTITIES } from "../__fixtures__/FonjepEntities";
import { RawApplication, RawFullGrant, RawPayment } from "../../../grant/@types/rawGrant";
import { DemandeSubvention, Grant, Payment } from "dto";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";

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

    describe("rawToGrant", () => {
        // @ts-expect-error: parameter type
        const FONJEP_APPLICATION: FonjepSubventionEntity = { fonjep: "application" };
        // @ts-expect-error: parameter type
        const FONJEP_PAYMENTS: FonjepPaymentEntity[] = [{ fonjep: "payment_1" }, { fonjep: "payment_2" }];
        // @ts-expect-error: parameter type
        const RAW_FULLGRANT: RawFullGrant<FonjepSubventionEntity, FonjepPaymentEntity> = {
            data: {
                application: FONJEP_APPLICATION,
                payments: FONJEP_PAYMENTS,
            },
        };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };
        // @ts-expect-error: parameter type
        const PAYMENT_1: Payment = { poo: "par" };
        // @ts-expect-error: parameter type
        const PAYMENT_2: Payment = { pee: "pez" };
        const GRANT: Grant = { application: APPLICATION, payments: [PAYMENT_1, PAYMENT_2] };

        let mockToDemandeSubvention: jest.SpyInstance;
        let mockToPayment: jest.SpyInstance;

        beforeAll(() => {
            mockToDemandeSubvention = jest.spyOn(FonjepEntityAdapter, "toDemandeSubvention");
            mockToDemandeSubvention.mockReturnValue(APPLICATION);
            mockToPayment = jest.spyOn(FonjepEntityAdapter, "toPayment");
        });

        beforeEach(() => {
            mockToPayment.mockReturnValueOnce(PAYMENT_1);
            mockToPayment.mockReturnValueOnce(PAYMENT_2);
        });

        afterEach(() => {
            mockToDemandeSubvention.mockClear();
            mockToPayment.mockClear();
        });

        afterAll(() => {
            mockToDemandeSubvention.mockRestore();
            mockToPayment.mockRestore();
        });

        it("should call toDemandeSubvention", () => {
            FonjepEntityAdapter.rawToGrant(RAW_FULLGRANT);
            expect(mockToDemandeSubvention).toHaveBeenCalledWith(FONJEP_APPLICATION);
        });

        it("should call toPayment", () => {
            FonjepEntityAdapter.rawToGrant(RAW_FULLGRANT);
            expect(mockToPayment).toHaveBeenCalledTimes(FONJEP_PAYMENTS.length);
            FONJEP_PAYMENTS.forEach((payment, index) => {
                expect(mockToPayment).toHaveBeenNthCalledWith(index + 1, payment);
            });
        });

        it("should return Grant", () => {
            const expected = GRANT;
            const actual = FonjepEntityAdapter.rawToGrant(RAW_FULLGRANT);
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };
        let mockToDemandeSubvention: jest.SpyInstance;

        beforeAll(() => {
            mockToDemandeSubvention = jest.spyOn(FonjepEntityAdapter, "toDemandeSubvention");
            mockToDemandeSubvention.mockReturnValue(APPLICATION);
        });

        afterEach(() => {
            mockToDemandeSubvention.mockClear();
        });

        afterAll(() => {
            mockToDemandeSubvention.mockRestore();
        });

        it("should call toDemandeSubvention", () => {
            FonjepEntityAdapter.rawToApplication(RAW_APPLICATION);
            expect(mockToDemandeSubvention).toHaveBeenCalledWith(APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            const expected = APPLICATION;
            const actual = FonjepEntityAdapter.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
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
