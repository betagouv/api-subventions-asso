import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import { Siren, Siret, Ridet, Tahitiet, Tahiti, Rid } from "../../identifier-objects";
import { CHORUS_ENTITIES } from "../../modules/providers/chorus/__fixtures__/ChorusFixtures";
import { DATA_BRETAGNE_RECORDS } from "../../modules/providers/data-bretagne/__fixtures__/dataBretagne.fixture";
import { DataBretagneService } from "../../modules/providers/data-bretagne/data-bretagne.service";
import { ChorusToPaymentFlat } from "./chorus-to-payment-flat";
import { GetRegionAttachementComptable } from "./get-region-attachement-comptable";

describe("ToPaymentFlat UseCase", () => {
    const mockDataBretagneService = { getMinistryEntity: jest.fn() } as unknown as jest.Mocked<DataBretagneService>;
    const mockGetRegion = { execute: jest.fn() } as unknown as jest.Mocked<GetRegionAttachementComptable>;

    const usecase = new ChorusToPaymentFlat(mockDataBretagneService, mockGetRegion);

    const COMPLEMENTARY_DATA = {
        programCode: 101,
        activityCode: "077601003222",
        actionCode: "0101-01-02",
        programEntity: DATA_BRETAGNE_RECORDS.programs[101],
        ministryEntity: DATA_BRETAGNE_RECORDS.ministries["code"],
        domaineFonctEntity: DATA_BRETAGNE_RECORDS.fonctionalDomains["0101-01-02"],
        refProgrammationEntity: DATA_BRETAGNE_RECORDS.programsRef["077601003222"],
    };

    describe("execute", () => {
        const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
        const SIRET = new Siret(DEFAULT_ASSOCIATION.siret);
        let mockBuildComplementaryData: jest.SpyInstance;
        let mockGetEstablishmentValueObject: jest.SpyInstance;
        let mockGetCompanyId: jest.SpyInstance;

        beforeEach(() => {
            mockBuildComplementaryData = jest.spyOn(
                usecase,
                //@ts-expect-error : test private method
                "buildComplementaryData",
            );
            mockGetEstablishmentValueObject = jest
                //@ts-expect-error : test private method
                .spyOn(usecase, "getEstablishmentValueObject")
                //@ts-expect-error : test private method
                .mockReturnValue(SIRET);
            mockGetCompanyId = jest
                //@ts-expect-error : test private method
                .spyOn(usecase, "getCompanyId")
                //@ts-expect-error : test private method
                .mockReturnValue(SIREN);
            mockGetRegion.execute.mockReturnValue("REGION");
            mockBuildComplementaryData.mockReturnValue(COMPLEMENTARY_DATA);
        });

        afterAll(() => {
            [mockBuildComplementaryData, mockGetEstablishmentValueObject, mockGetCompanyId].forEach(mock =>
                mock.mockRestore(),
            );
        });

        const INPUT = {
            chorusEntity: { ...CHORUS_ENTITIES[0] },
            programs: DATA_BRETAGNE_RECORDS.programs,
            ministries: DATA_BRETAGNE_RECORDS.ministries,
            fonctionalDomains: DATA_BRETAGNE_RECORDS.fonctionalDomains,
            programsRef: DATA_BRETAGNE_RECORDS.programsRef,
        };

        it("gets complementary data", () => {
            usecase.execute(INPUT);
            expect(mockBuildComplementaryData).toHaveBeenCalledWith(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );
        });

        it("defines establishment identifier", () => {
            usecase.execute(INPUT);
            expect(mockGetEstablishmentValueObject).toHaveBeenCalledWith(CHORUS_ENTITIES[0]);
        });

        it("defines association identifier", () => {
            usecase.execute(INPUT);
            expect(mockGetCompanyId).toHaveBeenCalledWith(SIRET);
        });

        it("gets region attachement comptable", () => {
            usecase.execute(INPUT);
            expect(mockGetRegion.execute).toHaveBeenCalledWith(CHORUS_ENTITIES[0].codeSociete);
        });

        it("returns PaymentFlatEntity when data is fully provided", () => {
            const result = usecase.execute(INPUT);
            expect(result).toMatchSnapshot();
        });

        it("should return PaymentFlatEntity with null when data is not fully provided", () => {
            mockBuildComplementaryData.mockReturnValueOnce({
                ...COMPLEMENTARY_DATA,
                programEntity: undefined,
            });
            const result = usecase.execute(INPUT);
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
            const actual = usecase.getCompanyId(new Siret("12345678900018"));
            const expected = SIREN;
            expect(actual).toEqual(expected);
        });

        it("should return Rid with Ridet", () => {
            // @ts-expect-error: private method
            const actual = usecase.getCompanyId(new Ridet("0482749145"));
            const expected = RID;
            expect(actual).toEqual(expected);
        });

        it("should return Tahiti with Tahitiet", () => {
            // @ts-expect-error: private method
            const actual = usecase.getCompanyId(new Tahitiet("A12345697"));
            const expected = TAHITI;
            expect(actual).toEqual(expected);
        });
    });

    describe("buildComplementaryData", () => {
        const mockGetMinistryEntity = jest.spyOn(mockDataBretagneService, "getMinistryEntity");
        // @ts-expect-error: private method
        const mockGetProgramCodeAndEntity = jest.spyOn(usecase, "getProgramCodeAndEntity");
        // @ts-expect-error: private method
        const mockGetActivityCodeAndEntity = jest.spyOn(usecase, "getActivityCodeAndEntity");
        // @ts-expect-error: private method
        const mockGetActionCodeAndEntity = jest.spyOn(usecase, "getActionCodeAndEntity");

        beforeEach(() => {
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
            usecase.buildComplementaryData(
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
            usecase.buildComplementaryData(
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
            usecase.buildComplementaryData(
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
            usecase.buildComplementaryData(
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
            const actual = usecase.buildComplementaryData(
                CHORUS_ENTITIES[0],
                DATA_BRETAGNE_RECORDS.programs,
                DATA_BRETAGNE_RECORDS.ministries,
                DATA_BRETAGNE_RECORDS.fonctionalDomains,
                DATA_BRETAGNE_RECORDS.programsRef,
            );

            expect(actual).toEqual(expected);
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
                usecase.getEstablishmentValueObject({ ...CHORUS_ENTITIES[0], siret: "#", ridetOrTahitiet: "#" }),
            ).toThrow(
                `Not able to retrieve an establishment identifier for chorus entity with EJ ${CHORUS_ENTITIES[0].ej} for exercice ${CHORUS_ENTITIES[0].exercice}`,
            );
        });

        it("returns Siret", () => {
            // @ts-expect-error: test private methode
            const actual = usecase.getEstablishmentValueObject({ ...CHORUS_ENTITIES[0] });
            expect(actual).toEqual(new Siret(CHORUS_ENTITIES[0].siret));
        });
        it("returns Ridet", () => {
            const RIDET = "123456789";
            mockIsSiret.mockReturnValueOnce(false);
            // @ts-expect-error: test private methode
            const actual = usecase.getEstablishmentValueObject({ ...CHORUS_ENTITIES[0], ridetOrTahitiet: RIDET });
            expect(actual).toEqual(new Ridet(RIDET));
        });
        it("returns Tahitied", () => {
            const TAHITIET = "A12345678";
            mockIsSiret.mockReturnValueOnce(false);
            mockIsRidet.mockReturnValueOnce(false);
            // @ts-expect-error: test private methode
            const actual = usecase.getEstablishmentValueObject({
                ...CHORUS_ENTITIES[0],
                ridetOrTahitiet: TAHITIET,
            });
            expect(actual).toEqual(new Siret(TAHITIET));
        });
    });
});
