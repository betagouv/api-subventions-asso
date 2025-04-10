import { ObjectId, WithId } from "mongodb";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import ChorusAdapter from "./ChorusAdapter";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { ENTITIES, PAYMENTS } from "../__fixtures__/ChorusFixtures";
import { RawPayment } from "../../../grant/@types/rawGrant";
import PROGRAMS from "../../../../../tests/dataProviders/db/__fixtures__/stateBudgetProgram";
import { ChorusLineDto } from "../@types/ChorusLineDto";
import { DATA_BRETAGNE_RECORDS } from "../../dataBretagne/__fixtures__/dataBretagne.fixture";
import { PAYMENT_FLAT_ENTITY } from "../../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import * as Sentry from "@sentry/node";

jest.mock("@sentry/node", () => ({
    captureException: jest.fn(),
}));

describe("ChorusAdapter", () => {
    const PROGRAM = PROGRAMS[0];

    const documentDataReturnedValue = {
        programCode: 101,
        activityCode: "077601003222",
        actionCode: "0101-01-02",
        programEntity: DATA_BRETAGNE_RECORDS.programs[101],
        ministryEntity: DATA_BRETAGNE_RECORDS.ministries["code"],
        domaineFonctEntity: DATA_BRETAGNE_RECORDS.domainesFonct["0101-01-02"],
        refProgrammationEntity: DATA_BRETAGNE_RECORDS.refsProgrammation["077601003222"],
    };

    const CHORUS_LINE_ENTITY = {
        ...ENTITIES[0],
        data: { ...(ENTITIES[0].data as ChorusLineDto), Société: "BRET" },
    };

    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = {
                indexedInformations: {
                    amount: 42789,
                    dateOperation: new Date("2022-02-02"),
                    codeDomaineFonctionnel: "0BOP-other",
                    exercice: 2022,
                },
            };
            // @ts-expect-error mock
            const actual = ChorusAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("rawToPayment", () => {
        //@ts-expect-error: parameter type
        const RAW_PAYMENT: RawPayment<ChorusLineEntity> = { data: ENTITIES[0] };

        let mockToPayment: jest.SpyInstance;
        beforeAll(() => {
            mockToPayment = jest.spyOn(ChorusAdapter, "toPayment");
            mockToPayment.mockReturnValue(PAYMENTS[0]);
        });

        afterAll(() => {
            mockToPayment.mockRestore();
        });

        it("should call toPayment()", () => {
            ChorusAdapter.rawToPayment(RAW_PAYMENT, PROGRAM);
            expect(ChorusAdapter.toPayment).toHaveBeenCalledWith(RAW_PAYMENT.data, PROGRAM);
        });

        it("should return Payment", () => {
            const expected = PAYMENTS[0];
            const actual = ChorusAdapter.rawToPayment(RAW_PAYMENT, PROGRAM);
            expect(actual).toEqual(expected);
        });
    });

    describe("toPayment", () => {
        const now = new Date();
        const toPV = (value: unknown, provider = "Chorus") =>
            ProviderValueAdapter.toProviderValue(value, provider, now);

        it("should return complet entity", () => {
            const entity = ENTITIES[0];

            const actual = ChorusAdapter.toPayment(entity as WithId<ChorusLineEntity>, PROGRAM);

            expect(actual).toMatchSnapshot();
        });

        it("should return partial entity", () => {
            const entity = new ChorusLineEntity(
                "UNIQUE_ID",
                new Date("2021-01-01"),
                {
                    codeBranche: "FAKE",
                    branche: "FAKE",
                    centreFinancier: "FAKE",
                    codeCentreFinancier: "FAKE",
                    domaineFonctionnel: "FAKE",
                    numeroDemandePaiement: "FAKE",
                    codeSociete: "FAKE",
                    exercice: 2023,
                    codeDomaineFonctionnel: "FAKE",
                    siret: "FAKE",
                    ej: "FAKE",
                    numPosteEJ: 1,
                    numPosteDP: 2,
                    amount: 0,
                    dateOperation: now,
                },
                {} as ChorusLineDto,
                "" as unknown as ObjectId,
            );

            const actual = ChorusAdapter.toPayment(entity as WithId<ChorusLineEntity>, PROGRAM);
            const expected = {
                codeBranche: toPV("FAKE"),
                branche: toPV("FAKE"),
                centreFinancier: toPV("FAKE"),
                domaineFonctionnel: toPV("FAKE"),
                siret: toPV("FAKE"),
                ej: toPV("FAKE"),
                amount: toPV(0),
                dateOperation: toPV(now),
                programme: toPV(PROGRAM.code_programme, dataBretagneService.provider.name),
                libelleProgramme: toPV(PROGRAM.label_programme, dataBretagneService.provider.name),
            };

            expect(actual).toMatchObject(expected);
        });
    });

    describe("toPaymentFlatEntity", () => {
        let mockGetPaymentFlatComplementaryData: jest.SpyInstance;
        beforeEach(() => {
            //@ts-expect-error : test private method
            mockGetPaymentFlatComplementaryData = jest.spyOn(ChorusAdapter, "getPaymentFlatComplementaryData");
            mockGetPaymentFlatComplementaryData.mockReturnValue(documentDataReturnedValue);
        });
        afterAll(() => {
            mockGetPaymentFlatComplementaryData.mockRestore();
        });

        it("should return PaymentFlatEntity when data is fully provided", () => {
            const result = ChorusAdapter.toNotAggregatedChorusPaymentFlatEntity(
                CHORUS_LINE_ENTITY,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );

            expect(result).toMatchSnapshot();
        });

        it("should return PaymentFlatEntity with null when data is not fully provided", () => {
            mockGetPaymentFlatComplementaryData.mockReturnValueOnce({
                ...documentDataReturnedValue,
                programEntity: undefined,
            });
            const result = ChorusAdapter.toNotAggregatedChorusPaymentFlatEntity(
                { ...CHORUS_LINE_ENTITY } as unknown as ChorusLineEntity,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );

            expect(result).toMatchSnapshot();
        });
    });

    // jest.spyOn(console, "error").mockImplementation(() => {});
    describe("getPaymentFlatComplementaryData", () => {
        // @ts-expect-error: test private method
        const mockGetProgramCodeAndEntity = jest.spyOn(ChorusAdapter, "getProgramCodeAndEntity");
        // @ts-expect-error: test private method
        const mockGetMinistryEntity = jest.spyOn(ChorusAdapter, "getMinistryEntity");
        // @ts-expect-error: test private method
        const mockGetActivityCodeAndEntity = jest.spyOn(ChorusAdapter, "getActivityCodeAndEntity");
        // @ts-expect-error: test private method
        const mockGetActionCodeAndEntity = jest.spyOn(ChorusAdapter, "getActionCodeAndEntity");

        const CHORUS_DTO = {
            // matches one of DATA_BRETAGNE_RECORDS.domainesFonct keys
            "Domaine fonctionnel CODE": "0163AC123",
            // matches one of DATA_BRETAGNE_RECORDS.refsProgrammation keys
            "Référentiel de programmation CODE": "AC4560000000",
        };

        // number must match one of DATA_BRETAGNE.programme keys
        const PROGRAM = DATA_BRETAGNE_RECORDS.programs[163];
        const PROG_CODE = PROGRAM.code_programme;
        // be careful that DATA_BRETAGNE_RECORDS.ministries as an entity which matches PROGRAM.code_ministere
        const MINISTRY = DATA_BRETAGNE_RECORDS.ministries[PROGRAM.code_ministere];
        const DOMAINE_FONCT = DATA_BRETAGNE_RECORDS.domainesFonct[CHORUS_DTO["Domaine fonctionnel CODE"]];
        const ACTION_CODE = DOMAINE_FONCT.code_action;
        const REF_PROG = DATA_BRETAGNE_RECORDS.refsProgrammation[CHORUS_DTO["Référentiel de programmation CODE"]];
        const ACTIVITY_CODE = REF_PROG.code_activite;

        beforeEach(() => {
            mockGetProgramCodeAndEntity.mockReturnValue({ code: PROG_CODE, entity: PROGRAM });
            mockGetMinistryEntity.mockReturnValue(MINISTRY);
            mockGetActionCodeAndEntity.mockReturnValue({ code: ACTION_CODE, entity: DOMAINE_FONCT });
            mockGetActivityCodeAndEntity.mockReturnValue({ code: ACTIVITY_CODE, entity: REF_PROG });
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("gets StateBudgetProgramEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockGetProgramCodeAndEntity).toHaveBeenCalledWith(CHORUS_DTO, DATA_BRETAGNE_RECORDS.programs);
        });

        it("gets MinistryEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockGetMinistryEntity).toHaveBeenCalledWith(PROGRAM, DATA_BRETAGNE_RECORDS.ministries);
        });

        it("gets DomaineFonctionnelEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockGetActionCodeAndEntity).toHaveBeenCalledWith(CHORUS_DTO, DATA_BRETAGNE_RECORDS.domainesFonct);
        });

        it("gets RefProgrammationEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
            expect(mockGetActivityCodeAndEntity).toHaveBeenCalledWith(
                CHORUS_DTO,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );
        });

        it("returns complementary data from data bretagne", () => {
            const expected = {
                programCode: PROG_CODE,
                activityCode: ACTIVITY_CODE,
                actionCode: ACTION_CODE,
                programEntity: PROGRAM,
                ministryEntity: MINISTRY,
                domaineFonctEntity: DOMAINE_FONCT,
                refProgrammationEntity: REF_PROG,
            };
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.domainesFonct,
                DATA_BRETAGNE_RECORDS.refsProgrammation,
            );

            expect(actual).toEqual(expected);
        });
    });

    describe("getRegionAttachementComptable", () => {
        const testCases = [
            ["ADCE", "Administration Centrale"],
            ["DOM1", "DOM-TOM"],
            ["ALSA", "Grand Est"],
            ["AQUI", "Nouvelle-Aquitaine"],
            ["AUVE", "Auvergne-Rhône-Alpes"],
        ];
        it.each(testCases)("should return the region for a given valid region code", (regionCode, expected) => {
            const actual = ChorusAdapter.getRegionAttachementComptable(regionCode);

            expect(actual).toEqual(expected);
        });

        it("should return region name not found for an invalid region code", () => {
            const actual = ChorusAdapter.getRegionAttachementComptable("INVALID");
            const expected = "code region inconnu";
            expect(actual).toBe(expected);
        });

        it("should call Sentry.captureException for an invalid region code", () => {
            ChorusAdapter.getRegionAttachementComptable("INVALID");

            expect(Sentry.captureException).toHaveBeenCalled();
        });

        it("should return N/A for a N/A region code", () => {
            const actual = ChorusAdapter.getRegionAttachementComptable("N/A");
            const expected = "N/A";
            expect(actual).toBe(expected);
        });
    });
});
