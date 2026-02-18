import GrantAdapter from "./grant.adapter";
import { Association, ProviderValues, EstablishmentSimplified } from "dto";
import paymentService from "../payments/payments.service";
import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    LONELY_CHORUS_PAYMENT,
} from "../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import { APPLICATION_LINK_TO_CHORUS } from "../applicationFlat/__fixtures__";
import { GrantFlatEntity } from "../../entities/GrantFlatEntity";
import { addDaysToDate } from "../../shared/helpers/DateHelper";

jest.mock("../payments/payments.service");

describe("GrantAdapter", () => {
    const makePVs = <T>(v: T) => [{ value: v }] as ProviderValues<T>;

    describe("findSingleProperty", () => {
        const PROPERTY = "KEY";
        const VALUE = "VALUE";
        const MULTIVALUE = "MULTI";
        const PAYMENT = { KEY: { value: VALUE } };

        it("if null payment arg returns undefined", () => {
            // @ts-expect-error -- test private
            const actual = GrantAdapter.findSingleProperty(null, PROPERTY, MULTIVALUE);
            expect(actual).toBeUndefined();
        });

        it("if single value and no adapter, return it", () => {
            const expected = { value: VALUE };
            // @ts-expect-error -- test private
            const actual = GrantAdapter.findSingleProperty([PAYMENT, PAYMENT, PAYMENT], PROPERTY, MULTIVALUE);
            expect(actual).toEqual(expected);
        });

        it("if single value and adapter, return actual value", () => {
            const expected = "ADAPTED";
            const ADAPTER = jest.fn(() => expected);
            // @ts-expect-error -- test private
            const actual = GrantAdapter.findSingleProperty([PAYMENT, PAYMENT, PAYMENT], PROPERTY, MULTIVALUE, ADAPTER);
            expect(actual).toBe(expected);
        });

        it("if several values, return multivalue arg", () => {
            const expected = MULTIVALUE;
            // @ts-expect-error -- test private
            const actual = GrantAdapter.findSingleProperty(
                // @ts-expect-error -- mock args
                [{ KEY: { value: "OTHER_VALUE" } }, PAYMENT, PAYMENT],
                PROPERTY,
                MULTIVALUE,
            );
            expect(actual).toBe(expected);
        });
    });

    describe("grantToExtractLine", () => {
        const SIRET = CHORUS_PAYMENT_FLAT_ENTITY.beneficiaryEstablishmentId.toString();

        const LAST_PAYMENT_DATE = new Date("2025-11-20");

        const PAYMENTS = [
            // make it the "last payment"
            { ...CHORUS_PAYMENT_FLAT_ENTITY, operationDate: new Date("2025-11-20") },
            { ...LONELY_CHORUS_PAYMENT, operationDate: addDaysToDate(LAST_PAYMENT_DATE, -30) },
        ];

        const LAST_PAYMENT = PAYMENTS[0];

        const GRANT = {
            application: APPLICATION_LINK_TO_CHORUS,
            payments: PAYMENTS,
        } as GrantFlatEntity;

        const ASSO = {
            denomination_rna: makePVs("nomRNA"),
            denomination_siren: makePVs("nomSiren"),
            rna: makePVs("W000000000"),
        } as Association;

        const ESTAB_BY_SIRET = {
            [SIRET]: {
                siret: makePVs(SIRET),
                nic: makePVs("1234"),
                adresse: makePVs({ code_postal: "31170" }),
            },
        } as Record<string, EstablishmentSimplified>;

        let singlePropMock: jest.SpyInstance;
        let addressToOneLineStringMock: jest.SpyInstance;
        let mockExtractExercise: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error -- mock
            singlePropMock = jest.spyOn(GrantAdapter, "findSingleProperty").mockReturnValue("aggregated");
            mockExtractExercise = jest.spyOn(GrantAdapter, "extractExerciseFromGrant").mockReturnValue(2024);
            // @ts-expect-error -- mock
            addressToOneLineStringMock = jest.spyOn(GrantAdapter, "addressToOneLineString").mockReturnValue("adresse");
            jest.mocked(paymentService.getPaymentExercise).mockReturnValue(2022);
        });

        it("adapts correctly", () => {
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            expect(actual).toMatchSnapshot();
        });

        it("chooses last financial center", () => {
            const expected = `${LAST_PAYMENT.financialCenterCode} - ${LAST_PAYMENT.financialCenterLabel}`;
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET).financialCenter;
            expect(actual).toBe(expected);
        });

        it("chooses last payment date", () => {
            const expected = "2025-11-20";
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET).paymentDate;
            expect(actual).toBe(expected);
        });

        it("extract budgetary exercise", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            expect(mockExtractExercise).toHaveBeenCalledWith(GRANT.application, LAST_PAYMENT);
        });

        it("paidAmount", () => {
            const expected = PAYMENTS[0].amount + PAYMENTS[1].amount;
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET).paidAmount;
            expect(actual).toBe(expected);
        });

        it("calls findSingleProperty for program", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            const expected = "aggregated";
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET).program;
            expect(singlePropMock).toHaveBeenCalledWith(
                GRANT.payments,
                "programme",
                "multi-programmes",
                expect.any(Function),
            );
            expect(actual).toBe(expected);
        });

        it("adapts program in findSingleProperty", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            const adapter = singlePropMock.mock.calls?.[0]?.[3];
            const expected = `${LAST_PAYMENT.programNumber} - ${LAST_PAYMENT.programName}`;
            const actual = adapter(PAYMENTS[0]);
            expect(actual).toBe(expected);
        });

        it("use denomination_siren of no denomination_rna", () => {
            const expected = "nomSiren";
            const actual = GrantAdapter.grantToExtractLine(
                GRANT,
                { ...ASSO, denomination_rna: undefined },
                ESTAB_BY_SIRET,
            ).assoName;
            expect(actual).toBe(expected);
        });

        it("gets postalCode", () => {
            const expected = "31170";
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET).postalCode;
            expect(actual).toBe(expected);
        });

        it("gets formatted address", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            const expected = "adresse";
            const actual = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET).estabAddress;
            expect(addressToOneLineStringMock).toHaveBeenCalledWith({ code_postal: "31170" });
            expect(actual).toBe(expected);
        });

        it("adapts correctly with no application", () => {
            const actual = GrantAdapter.grantToExtractLine(
                { payments: GRANT.payments, application: null },
                ASSO,
                ESTAB_BY_SIRET,
            );
            expect(actual).toMatchSnapshot();
        });

        it("adapts correctly with no payment", () => {
            const actual = GrantAdapter.grantToExtractLine(
                { application: GRANT.application, payments: [] },
                ASSO,
                ESTAB_BY_SIRET,
            );
            expect(actual).toMatchSnapshot();
        });

        // subventia application doesn't have budgetaryYear as of 2026/01/05
        it("handle undefined exercise in both application and payment -- subventia edge case", () => {
            mockExtractExercise.mockReturnValueOnce(null);
            const actual = GrantAdapter.grantToExtractLine(
                // @ts-expect-error: mock
                { application: { ...GRANT.application, budgetaryYear: null }, payments: [] },
                ASSO,
                ESTAB_BY_SIRET,
            );
            expect(actual.exercice).toBeNull();
        });
    });
});
