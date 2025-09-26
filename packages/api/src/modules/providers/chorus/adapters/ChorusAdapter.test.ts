import ChorusLineEntity from "../entities/ChorusLineEntity";
import ChorusAdapter from "./ChorusAdapter";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { ENTITIES } from "../__fixtures__/ChorusFixtures";
import { ChorusLineDto } from "../@types/ChorusLineDto";
import { DATA_BRETAGNE_RECORDS } from "../../dataBretagne/__fixtures__/dataBretagne.fixture";
import * as Sentry from "@sentry/node";
import Tahitiet from "../../../../identifierObjects/Tahitiet";
import Ridet from "../../../../identifierObjects/Ridet";
import Siret from "../../../../identifierObjects/Siret";
import Siren from "../../../../identifierObjects/Siren";
import Tahiti from "../../../../identifierObjects/Tahiti";
import Rid from "../../../../identifierObjects/Rid";
import { GenericParser } from "../../../../shared/GenericParser";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";

jest.mock("@sentry/node", () => ({
    captureException: jest.fn(),
}));

describe("ChorusAdapter", () => {
    const documentDataReturnedValue = {
        programCode: 101,
        activityCode: "077601003222",
        actionCode: "0101-01-02",
        programEntity: DATA_BRETAGNE_RECORDS.programs[101],
        ministryEntity: DATA_BRETAGNE_RECORDS.ministries["code"],
        domaineFonctEntity: DATA_BRETAGNE_RECORDS.fonctionalDomains["0101-01-02"],
        refProgrammationEntity: DATA_BRETAGNE_RECORDS.programsRef["077601003222"],
    };

    const CHORUS_LINE_ENTITY = {
        ...ENTITIES[0],
        data: { ...(ENTITIES[0].data as ChorusLineDto), Société: "BRET" },
    };

    describe("toNotAggregatedPaymentFlatEntity", () => {
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
            const result = ChorusAdapter.toNotAggregatedPaymentFlatEntity(
                CHORUS_LINE_ENTITY,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );

            expect(result).toMatchSnapshot();
        });

        it("should return PaymentFlatEntity with null when data is not fully provided", () => {
            mockGetPaymentFlatComplementaryData.mockReturnValueOnce({
                ...documentDataReturnedValue,
                programEntity: undefined,
            });
            const result = ChorusAdapter.toNotAggregatedPaymentFlatEntity(
                { ...CHORUS_LINE_ENTITY } as unknown as ChorusLineEntity,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );

            expect(result).toMatchSnapshot();
        });
    });

    describe("getPaymentFlatComplementaryData", () => {
        const mockGetMinistryEntity = jest.spyOn(dataBretagneService, "getMinistryEntity");
        // @ts-expect-error: private method
        const mockGetProgramCodeAndEntity = jest.spyOn(ChorusAdapter, "getProgramCodeAndEntity");
        // @ts-expect-error: private method
        const mockGetActivityCodeAndEntity = jest.spyOn(ChorusAdapter, "getActivityCodeAndEntity");
        // @ts-expect-error: private method
        const mockGetActionCodeAndEntity = jest.spyOn(ChorusAdapter, "getActionCodeAndEntity");

        const CHORUS_DTO = {
            // matches one of DATA_BRETAGNE_RECORDS.fonctionalDomains keys
            "Domaine fonctionnel CODE": "0163AC123",
            // matches one of DATA_BRETAGNE_RECORDS.programsRef keys
            "Référentiel de programmation CODE": "AC4560000000",
        };

        // number must match one of DATA_BRETAGNE.programme keys
        const PROGRAM = DATA_BRETAGNE_RECORDS.programs[163];
        const PROG_CODE = PROGRAM.code_programme;
        // be careful that DATA_BRETAGNE_RECORDS.ministries as an entity which matches PROGRAM.code_ministere
        const MINISTRY = DATA_BRETAGNE_RECORDS.ministries[PROGRAM.code_ministere];
        const DOMAINE_FONCT = DATA_BRETAGNE_RECORDS.fonctionalDomains[CHORUS_DTO["Domaine fonctionnel CODE"]];
        const ACTION_CODE = DOMAINE_FONCT.code_action;
        const REF_PROG = DATA_BRETAGNE_RECORDS.programsRef[CHORUS_DTO["Référentiel de programmation CODE"]];
        const ACTIVITY_CODE = REF_PROG.code_activite;

        beforeEach(() => {
            // @ts-expect-error: mock
            mockGetProgramCodeAndEntity.mockReturnValue({ code: PROG_CODE, entity: PROGRAM });
            mockGetMinistryEntity.mockReturnValue(MINISTRY);
            // @ts-expect-error: mock
            mockGetActionCodeAndEntity.mockReturnValue({ code: ACTION_CODE, entity: DOMAINE_FONCT });
            // @ts-expect-error: mock
            mockGetActivityCodeAndEntity.mockReturnValue({ code: ACTIVITY_CODE, entity: REF_PROG });
        });

        afterAll(() => {
            [
                mockGetActionCodeAndEntity,
                mockGetMinistryEntity,
                mockGetActionCodeAndEntity,
                mockGetActivityCodeAndEntity,
            ].map(mock => mock.mockRestore());
        });

        it("gets StateBudgetProgramEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetProgramCodeAndEntity).toHaveBeenCalledWith(CHORUS_DTO, DATA_BRETAGNE_RECORDS.programs);
        });

        it("gets MinistryEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetMinistryEntity).toHaveBeenCalledWith(PROGRAM, DATA_BRETAGNE_RECORDS.ministries);
        });

        it("gets DomaineFonctionnelEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetActionCodeAndEntity).toHaveBeenCalledWith(
                CHORUS_DTO,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
            );
        });

        it("gets RefProgrammationEntity", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatComplementaryData(
                CHORUS_DTO as ChorusLineDto,
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetActivityCodeAndEntity).toHaveBeenCalledWith(CHORUS_DTO, DATA_BRETAGNE_RECORDS.programsRef);
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
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
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

    describe("getEstablishmentValueObject", () => {
        const mockIsRidet = jest.fn().mockReturnValue(true);
        const mockIsTahitiet = jest.fn().mockReturnValue(true);
        const mockIsSiret = jest.fn().mockReturnValue(true);

        // Only mock isRidet, isTahitiet and isSiret
        // If we wanted to be 100% unit testing we should create a mock in __mocks__ folder
        beforeAll(() => {
            Ridet.isRidet = mockIsRidet;
            Siret.isSiret = mockIsSiret;
            Tahitiet.isTahitiet = mockIsTahitiet;
        });

        it("throws error if no SIRET or RIDET or TAHITI defined", () => {
            // @ts-expect-error: partial chorus line dto
            const ENTITY = {
                "N° EJ": "123456789",
                "Exercice comptable": 2023,
                "Code taxe 1": "#",
                "No TVA 3 (COM-RIDET ou TAHITI)": "#",
            } as ChorusLineDto;

            // @ts-expect-error: private method
            expect(() => ChorusAdapter.getEstablishmentValueObject(ENTITY)).toThrow(
                `Not able to retrieve an establishment identifier for chorus line with EJ ${ENTITY["N° EJ"]} for exercice ${ENTITY["Exercice comptable"]}`,
            );
        });

        it.each`
            siret               | ridetOrTahitiet | valueObject
            ${"12345678900018"} | ${"#"}          | ${Siret}
            ${"#"}              | ${"0482749145"} | ${Ridet}
            ${"#"}              | ${"A1234569"}   | ${Tahitiet}
        `("should return $valueObject.name if code taxe is not #", ({ siret, ridetOrTahitiet, valueObject }) => {
            // When testing Tahitied we must force isRidet to false
            if (valueObject === Tahitiet) mockIsRidet.mockReturnValueOnce(false);

            const ENTITY = {
                "Code taxe 1": siret,
                "No TVA 3 (COM-RIDET ou TAHITI)": ridetOrTahitiet,
            } as ChorusLineDto;
            const expected = valueObject;
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getEstablishmentValueObject(ENTITY);
            expect(actual).toBeInstanceOf(expected);
        });
    });

    describe("getCompanyId", () => {
        let RID, TAHITI, SIREN;
        const mockToRid = jest.spyOn(Ridet.prototype, "toRid");
        const mockToTahiti = jest.spyOn(Tahitiet.prototype, "toTahiti");
        const mockToSiren = jest.spyOn(Siret.prototype, "toSiren");
        const mockIsRidet = jest.spyOn(Ridet, "isRidet");
        const mockIsSiret = jest.spyOn(Siret, "isSiret");
        const mockIsTahiti = jest.spyOn(Tahiti, "isTahiti");
        const mockIsTahitiet = jest.spyOn(Tahitiet, "isTahitiet");
        const mockIsSiren = jest.spyOn(Siren, "isSiren");
        const mockIsRid = jest.spyOn(Rid, "isRid");

        // Only partial mock of ValueObject classes
        // If we wanted to be 100% unit testing we should create a mock in __mocks__ folder
        beforeAll(() => {
            RID = new Rid("0482749");
            TAHITI = new Tahiti("A12345");
            SIREN = new Siren("123456789");
            mockToRid.mockReturnValue(RID);
            mockToTahiti.mockReturnValue(TAHITI);
            mockToSiren.mockReturnValue(SIREN);

            mockIsRidet.mockReturnValue(true);
            mockIsTahitiet.mockReturnValue(true);
            mockIsSiret.mockReturnValue(true);

            // only used in the new ValueObject() to bypass the check in constructor
            mockIsRid.mockReturnValue(true);
            mockIsTahiti.mockReturnValue(true);
            mockIsSiren.mockReturnValue(true);
        });

        afterAll(() => {
            [
                mockIsRid,
                mockIsRidet,
                mockIsSiren,
                mockIsSiret,
                mockIsTahiti,
                mockIsTahitiet,
                mockToRid,
                mockToTahiti,
                mockToSiren,
            ].forEach(mock => {
                mock.mockRestore();
            });
        });

        it("should return Siren with Siren", () => {
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getCompanyId(new Siret("12345678900018"));
            const expected = SIREN;
            expect(actual).toEqual(expected);
        });

        it("should return Rid with Ridet", () => {
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getCompanyId(new Ridet("0482749145"));
            const expected = RID;
            expect(actual).toEqual(expected);
        });

        it("should return Tahiti with Tahitiet", () => {
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getCompanyId(new Tahitiet("A12345697"));
            const expected = TAHITI;
            expect(actual).toEqual(expected);
        });
    });

    describe("getAmount", () => {
        it("should return amount with value", () => {
            const CHORUS_LINE_DTO = {
                "Montant payé": 9987,
            } as ChorusLineDto;

            const expected = CHORUS_LINE_DTO["Montant payé"];
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getAmount(CHORUS_LINE_DTO);
            expect(actual).toEqual(expected);
        });

        it("should return amount with string value", () => {
            // @ts-expect-error: edge case
            const CHORUS_LINE_DTO = {
                "Montant payé": "9987,50",
            } as ChorusLineDto;

            const expected = 9987.5;
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getAmount(CHORUS_LINE_DTO);
            expect(actual).toEqual(expected);
        });

        it("should return null if neither string or number", () => {
            // @ts-expect-error: edge case
            const CHORUS_LINE_DTO = {
                "Montant payé": [9988],
            } as ChorusLineDto;
            const expected = null;

            // @ts-expect-error: private method
            const actual = ChorusAdapter.getAmount(CHORUS_LINE_DTO);
            expect(actual).toEqual(expected);
        });
    });

    describe("getOperationDate", () => {
        const JS_DATE = new Date("2025-02-02");
        const mockExcelDateToJsDate = jest.spyOn(GenericParser, "ExcelDateToJSDate");

        beforeEach(() => {
            mockExcelDateToJsDate.mockReturnValue(JS_DATE);
        });

        afterAll(() => {
            mockExcelDateToJsDate.mockRestore();
        });

        it("should return operation date with excel date", () => {
            // TODO: don't know why I need to mock the GenericParser.ExcelDateToJSDate like this
            // but it fails if I rely on the mockExcelDateToJsDate (the mock doesn't work only for this test)
            const originalParser = GenericParser.ExcelDateToJSDate;
            GenericParser.ExcelDateToJSDate = jest.fn().mockReturnValue(JS_DATE);

            const CHORUS_LINE_DTO = {
                "Date de dernière opération sur la DP": 46959,
            };
            // @ts-expect-error: mock
            const actual = ChorusAdapter.getOperationDate(CHORUS_LINE_DTO);
            const expected = JS_DATE;
            expect(actual).toEqual(expected);
            GenericParser.ExcelDateToJSDate = originalParser;
        });

        it("should return operation date with DD/MM/YYYY date", () => {
            const CHORUS_LINE_DTO = {
                "Date de dernière opération sur la DP": "02/02/2025",
            };
            // @ts-expect-error: mock
            const actual = ChorusAdapter.getOperationDate(CHORUS_LINE_DTO);
            const expected = JS_DATE;
            expect(actual).toEqual(expected);
        });

        it("should return null if field is not defined", () => {
            const CHORUS_LINE_DTO = {};
            // @ts-expect-error: mock
            const actual = ChorusAdapter.getOperationDate(CHORUS_LINE_DTO);
            const expected = null;
            expect(actual).toEqual(expected);
        });
    });

    // TODO: test this method
    describe("getPaymentFlatRawData", () => {
        const SIRET_ESTAB = new Siret("12345678900018");
        const SIREN_ESTAB = new Siren("123456789");
        const CHORUS_LINE_DTO = CHORUS_LINE_ENTITY.data;
        // @ts-expect-error: mock private method
        const mockGetCompanyId = jest.spyOn(ChorusAdapter, "getCompanyId");
        // @ts-expect-error: mock private method
        const mockGetAmount = jest.spyOn(ChorusAdapter, "getAmount");
        // @ts-expect-error: mock private method
        const mockGetOperationDate = jest.spyOn(ChorusAdapter, "getOperationDate");
        // @ts-expect-error: mock private method
        const mockGetEstablishmentValueObject = jest.spyOn(ChorusAdapter, "getEstablishmentValueObject");

        beforeEach(() => {
            // @ts-expect-error: mock
            mockGetEstablishmentValueObject.mockReturnValue(SIRET_ESTAB);
            // @ts-expect-error: mock
            mockGetCompanyId.mockReturnValue(SIREN_ESTAB);
            // @ts-expect-error: mock
            mockGetAmount.mockReturnValue(1000);
            // @ts-expect-error: mock
            mockGetOperationDate.mockReturnValue(new Date("2025-02-02"));
        });

        afterAll(() => {
            [mockGetEstablishmentValueObject, mockGetCompanyId, mockGetAmount, mockGetOperationDate].forEach(mock => {
                mock.mockRestore();
            });
        });

        it("should get establishment value object", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatRawData(CHORUS_LINE_DTO);
            expect(mockGetEstablishmentValueObject).toHaveBeenCalledWith(CHORUS_LINE_DTO);
        });

        it("should get company identifier", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatRawData(CHORUS_LINE_DTO);
            expect(mockGetCompanyId).toHaveBeenCalledWith(SIRET_ESTAB);
        });

        it("should get the amount", () => {
            // @ts-expect-error: private method
            ChorusAdapter.getPaymentFlatRawData(CHORUS_LINE_DTO);
            expect(mockGetAmount).toHaveBeenCalledWith(CHORUS_LINE_DTO);
        });

        it("should return PaymentFlatRawData", () => {
            // @ts-expect-error: private method
            const actual = ChorusAdapter.getPaymentFlatRawData(CHORUS_LINE_DTO);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("buildUniqueId", () => {
        it("return a uniqueId", () => {
            const { uniqueId, ...partialPaymentFlat } = CHORUS_PAYMENT_FLAT_ENTITY;
            // @ts-expect-error: test private method
            const actual = ChorusAdapter.buildFlatUniqueId(partialPaymentFlat);
            expect(actual).toMatchSnapshot();
        });
    });
});
