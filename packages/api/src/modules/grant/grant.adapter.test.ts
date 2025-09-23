import GrantAdapter from "./grant.adapter";
import {
    ApplicationStatus,
    Association,
    Grant,
    Payment,
    ProviderValue,
    ProviderValues,
    EstablishmentSimplified,
} from "dto";
import { GrantToExtract } from "./@types/GrantToExtract";
import paymentService from "../payments/payments.service";

jest.mock("../payments/payments.service");

describe("GrantAdapter", () => {
    const makePV = <T>(v: T) => ({ value: v }) as ProviderValue<T>;
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

        it("if single value and adapter, return adapted value", () => {
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
        const SIRET = "01234567891234";

        const PAYMENT = {
            programme: makePV("codePogramme"),
            libelleProgramme: makePV("label"),
            amount: makePV(2000),
            annee_demande: makePV(2022),
            dateOperation: makePV(new Date("2022-02-02")),
            centreFinancier: makePV("centreFinancier2"),
        } as unknown as Payment;

        const GRANT = {
            application: {
                siret: makePV(SIRET),
                annee_demande: makePV(2022),
                actions_proposee: [{ intitule: makePV("intituléAction") }],
                montants: {
                    demande: makePV(12000),
                    accorde: makePV(10000),
                },
                service_instructeur: makePV("instructeur"),
                dispositif: makePV("dispositif"),
                statut_label: makePV(ApplicationStatus.GRANTED),
            },
            payments: [
                PAYMENT,
                {
                    ...PAYMENT,
                    dateOperation: makePV(new Date("2022-01-01")),
                    centreFinancier: makePV("centreFinancier1"),
                },
                {
                    ...PAYMENT,
                    dateOperation: makePV(new Date("2022-03-03")),
                    centreFinancier: makePV("centreFinancier3"),
                },
            ] as Payment[],
        } as Grant;

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

        let adapted: GrantToExtract;
        let singlePropMock: jest.SpyInstance;
        let addressToOneLineStringMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error -- mock
            singlePropMock = jest.spyOn(GrantAdapter, "findSingleProperty").mockReturnValue("aggregated");
            // @ts-expect-error -- mock
            addressToOneLineStringMock = jest.spyOn(GrantAdapter, "addressToOneLineString").mockReturnValue("adresse");
            jest.mocked(paymentService.getPaymentExercise).mockReturnValue(2022);

            adapted = GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
        });

        it("adapts correctly", () => {
            expect(adapted).toMatchSnapshot();
        });

        it("chooses last financial center", () => {
            const expected = "centreFinancier3";
            const actual = adapted.financialCenter;
            expect(actual).toBe(expected);
        });

        it("chooses last payment date", () => {
            const expected = "2022-03-03";
            const actual = adapted.paymentDate;
            expect(actual).toBe(expected);
        });

        it("paidAmount", () => {
            const expected = 6000;
            const actual = adapted.paidAmount;
            expect(actual).toBe(expected);
        });

        it("calls findSingleProperty for program", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            const expected = "aggregated";
            const actual = adapted.program;
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
            const expected = "code - libellé";
            const actual = adapter({ programme: makePV("code"), libelleProgramme: makePV("libellé") });
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
            const actual = adapted.postalCode;
            expect(actual).toBe(expected);
        });

        it("gets formatted address", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            const expected = "adresse";
            const actual = adapted.estabAddress;
            expect(addressToOneLineStringMock).toHaveBeenCalledWith({ code_postal: "31170" });
            expect(actual).toBe(expected);
        });

        it("does not require payment exercise if info from application", () => {
            GrantAdapter.grantToExtractLine(GRANT, ASSO, ESTAB_BY_SIRET);
            expect(paymentService.getPaymentExercise).not.toHaveBeenCalled();
        });

        it("adapts correctly with no application", () => {
            const actual = GrantAdapter.grantToExtractLine(
                { payments: GRANT.payments, application: null },
                ASSO,
                ESTAB_BY_SIRET,
            );
            expect(actual).toMatchSnapshot();
        });

        it("gets exercise from paymentService if no application", () => {
            const expected = 1990;
            jest.mocked(paymentService.getPaymentExercise).mockReturnValueOnce(expected);
            const actual = GrantAdapter.grantToExtractLine(
                { payments: GRANT.payments, application: null },
                ASSO,
                ESTAB_BY_SIRET,
            ).exercice;
            expect(paymentService.getPaymentExercise).toHaveBeenCalledWith(GRANT.payments?.[0]);
            expect(actual).toBe(expected);
        });

        it("adapts correctly with no payment", () => {
            const actual = GrantAdapter.grantToExtractLine(
                { application: GRANT.application, payments: null },
                ASSO,
                ESTAB_BY_SIRET,
            );
            expect(actual).toMatchSnapshot();
        });
    });
});
