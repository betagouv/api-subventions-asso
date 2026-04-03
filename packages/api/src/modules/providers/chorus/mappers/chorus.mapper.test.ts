import ChorusMapper from "./chorus.mapper";
import dataBretagneService from "../../data-bretagne/data-bretagne.service";
import { DATA_BRETAGNE_RECORDS } from "../../data-bretagne/__fixtures__/dataBretagne.fixture";
import Tahitiet from "../../../../identifier-objects/Tahitiet";
import Ridet from "../../../../identifier-objects/Ridet";
import Siret from "../../../../identifier-objects/Siret";
import Siren from "../../../../identifier-objects/Siren";
import Tahiti from "../../../../identifier-objects/Tahiti";
import Rid from "../../../../identifier-objects/Rid";
import { CHORUS_ENTITIES } from "../__fixtures__/ChorusFixtures";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import EstablishmentIdentifier from "../../../../identifier-objects/EstablishmentIdentifier";

jest.mock("@sentry/node", () => ({
    captureException: jest.fn(),
}));
jest.mock("../../../../identifier-objects/EstablishmentIdentifier");

describe("ChorusMapper", () => {
    const COMPLEMENTARY_DATA = {
        programCode: 101,
        activityCode: "077601003222",
        actionCode: "0101-01-02",
        programEntity: DATA_BRETAGNE_RECORDS.programs[101],
        ministryEntity: DATA_BRETAGNE_RECORDS.ministries["code"],
        domaineFonctEntity: DATA_BRETAGNE_RECORDS.fonctionalDomains["0101-01-02"],
        refProgrammationEntity: DATA_BRETAGNE_RECORDS.programsRef["077601003222"],
    };

    describe("toNotAggregatedPaymentFlatEntity", () => {
        const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
        const SIRET = new Siret(DEFAULT_ASSOCIATION.siret);
        let mockBuildComplementaryData: jest.SpyInstance;
        let mockGetEstablishmentValueObject: jest.SpyInstance;
        let mockGetCompanyId: jest.SpyInstance;
        let mockGetRegionAttachementComptable: jest.SpyInstance;

        beforeEach(() => {
            mockBuildComplementaryData = jest.spyOn(
                ChorusMapper,
                //@ts-expect-error : test private method
                "buildComplementaryData",
            );
            mockGetEstablishmentValueObject = jest
                //@ts-expect-error : test private method
                .spyOn(ChorusMapper, "getEstablishmentValueObject")
                //@ts-expect-error : test private method
                .mockReturnValue(SIRET);
            mockGetCompanyId = jest
                //@ts-expect-error : test private method
                .spyOn(ChorusMapper, "getCompanyId")
                //@ts-expect-error : test private method
                .mockReturnValue(SIREN);
            mockGetRegionAttachementComptable = jest
                .spyOn(ChorusMapper, "getRegionAttachementComptable")
                .mockReturnValue("REGION");
            mockBuildComplementaryData.mockReturnValue(COMPLEMENTARY_DATA);
        });

        afterAll(() => {
            [
                mockBuildComplementaryData,
                mockGetEstablishmentValueObject,
                mockGetCompanyId,
                mockGetRegionAttachementComptable,
            ].forEach(mock => mock.mockRestore());
        });

        it("gets complementary data", () => {
            ChorusMapper.toNotAggregatedPaymentFlatEntity(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockBuildComplementaryData).toHaveBeenCalledWith(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
        });

        it("defines establishment identifier", () => {
            ChorusMapper.toNotAggregatedPaymentFlatEntity(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetEstablishmentValueObject).toHaveBeenCalledWith(CHORUS_ENTITIES[0]);
        });

        it("defines association identifier", () => {
            ChorusMapper.toNotAggregatedPaymentFlatEntity(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetCompanyId).toHaveBeenCalledWith(SIRET);
        });

        it("gets region attachement comptable", () => {
            ChorusMapper.toNotAggregatedPaymentFlatEntity(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetRegionAttachementComptable).toHaveBeenCalledWith(CHORUS_ENTITIES[0].codeSociete);
        });

        it("returns PaymentFlatEntity when data is fully provided", () => {
            const result = ChorusMapper.toNotAggregatedPaymentFlatEntity(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );

            expect(result).toMatchSnapshot();
        });

        it("should return PaymentFlatEntity with null when data is not fully provided", () => {
            mockBuildComplementaryData.mockReturnValueOnce({
                ...COMPLEMENTARY_DATA,
                programEntity: undefined,
            });
            const result = ChorusMapper.toNotAggregatedPaymentFlatEntity(
                { ...CHORUS_ENTITIES[0] },
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );

            expect(result).toMatchSnapshot();
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
            const actual = ChorusMapper.getCompanyId(new Siret("12345678900018"));
            const expected = SIREN;
            expect(actual).toEqual(expected);
        });

        it("should return Rid with Ridet", () => {
            // @ts-expect-error: private method
            const actual = ChorusMapper.getCompanyId(new Ridet("0482749145"));
            const expected = RID;
            expect(actual).toEqual(expected);
        });

        it("should return Tahiti with Tahitiet", () => {
            // @ts-expect-error: private method
            const actual = ChorusMapper.getCompanyId(new Tahitiet("A12345697"));
            const expected = TAHITI;
            expect(actual).toEqual(expected);
        });
    });

    describe("buildComplementaryData", () => {
        const mockGetMinistryEntity = jest.spyOn(dataBretagneService, "getMinistryEntity");
        // @ts-expect-error: private method
        const mockGetProgramCodeAndEntity = jest.spyOn(ChorusMapper, "getProgramCodeAndEntity");
        // @ts-expect-error: private method
        const mockGetActivityCodeAndEntity = jest.spyOn(ChorusMapper, "getActivityCodeAndEntity");
        // @ts-expect-error: private method
        const mockGetActionCodeAndEntity = jest.spyOn(ChorusMapper, "getActionCodeAndEntity");

        beforeEach(() => {
            jest.mocked(EstablishmentIdentifier.getAssociationIdentifier).mockReturnValue(
                new Siren(DEFAULT_ASSOCIATION.siren),
            );
            // @ts-expect-error: mock
            mockGetProgramCodeAndEntity.mockReturnValue({
                code: COMPLEMENTARY_DATA.programCode,
                entity: COMPLEMENTARY_DATA.programEntity,
            });
            mockGetMinistryEntity.mockReturnValue(COMPLEMENTARY_DATA.ministryEntity);
            // @ts-expect-error: mock
            mockGetActionCodeAndEntity.mockReturnValue({
                code: COMPLEMENTARY_DATA.actionCode,
                entity: COMPLEMENTARY_DATA.domaineFonctEntity,
            });
            // @ts-expect-error: mock
            mockGetActivityCodeAndEntity.mockReturnValue({
                code: COMPLEMENTARY_DATA.activityCode,
                entity: COMPLEMENTARY_DATA.refProgrammationEntity,
            });
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
            ChorusMapper.buildComplementaryData(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetProgramCodeAndEntity).toHaveBeenCalledWith(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
            );
        });

        it("gets MinistryEntity", () => {
            // @ts-expect-error: private method
            ChorusMapper.buildComplementaryData(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetMinistryEntity).toHaveBeenCalledWith(
                COMPLEMENTARY_DATA.programEntity,
                DATA_BRETAGNE_RECORDS.ministries,
            );
        });

        it("gets DomaineFonctionnelEntity", () => {
            // @ts-expect-error: private method
            ChorusMapper.buildComplementaryData(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetActionCodeAndEntity).toHaveBeenCalledWith(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
            );
        });

        it("gets RefProgrammationEntity", () => {
            // @ts-expect-error: private method
            ChorusMapper.buildComplementaryData(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
            expect(mockGetActivityCodeAndEntity).toHaveBeenCalledWith(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programsRef,
            );
        });

        it("returns complementary data from data bretagne", () => {
            const expected = {
                programCode: COMPLEMENTARY_DATA.programCode,
                activityCode: COMPLEMENTARY_DATA.activityCode,
                actionCode: COMPLEMENTARY_DATA.actionCode,
                programEntity: COMPLEMENTARY_DATA.programEntity,
                ministryEntity: COMPLEMENTARY_DATA.ministryEntity,
                domaineFonctEntity: COMPLEMENTARY_DATA.domaineFonctEntity,
                refProgrammationEntity: COMPLEMENTARY_DATA.refProgrammationEntity,
            };
            // @ts-expect-error: private method
            const actual = ChorusMapper.buildComplementaryData(
                CHORUS_ENTITIES[0],
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
            const actual = ChorusMapper.getRegionAttachementComptable(regionCode);

            expect(actual).toEqual(expected);
        });

        it("returns null when given string doesn't match a region code", () => {
            const actual = ChorusMapper.getRegionAttachementComptable("INVALID");
            const expected = null;
            expect(actual).toBe(expected);
        });

        it("should return N/A for a N/A region code", () => {
            const actual = ChorusMapper.getRegionAttachementComptable("N/A");
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
            mockIsSiret.mockReturnValueOnce(false);
            mockIsRidet.mockReturnValueOnce(false);
            mockIsTahitiet.mockReturnValueOnce(false);
            expect(() =>
                // @ts-expect-error: private method
                ChorusMapper.getEstablishmentValueObject({ ...CHORUS_ENTITIES[0], siret: "#", ridetOrTahitiet: "#" }),
            ).toThrow(
                `Not able to retrieve an establishment identifier for chorus entity with EJ ${CHORUS_ENTITIES[0].ej} for exercice ${CHORUS_ENTITIES[0].exercice}`,
            );
        });

        it("returns Siret", () => {
            // @ts-expect-error: test private methode
            const actual = ChorusMapper.getEstablishmentValueObject({ ...CHORUS_ENTITIES[0] });
            expect(actual).toEqual(new Siret(CHORUS_ENTITIES[0].siret));
        });
        it("returns Ridet", () => {
            const RIDET = "123456789";
            mockIsSiret.mockReturnValueOnce(false);
            // @ts-expect-error: test private methode
            const actual = ChorusMapper.getEstablishmentValueObject({ ...CHORUS_ENTITIES[0], ridetOrTahitiet: RIDET });
            expect(actual).toEqual(new Ridet(RIDET));
        });
        it("returns Tahitied", () => {
            const TAHITIET = "A12345678";
            mockIsSiret.mockReturnValueOnce(false);
            mockIsRidet.mockReturnValueOnce(false);
            // @ts-expect-error: test private methode
            const actual = ChorusMapper.getEstablishmentValueObject({
                ...CHORUS_ENTITIES[0],
                ridetOrTahitiet: TAHITIET,
            });
            expect(actual).toEqual(new Siret(TAHITIET));
        });
    });
});
