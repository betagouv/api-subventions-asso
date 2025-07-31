import subventiaService from "./subventia.service";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import SubventiaPort from "../../../dataProviders/db/providers/subventia/subventia.port";
import SubventiaEntity, { SubventiaDbo } from "./@types/subventia.entity";
import { CommonApplicationDto, ApplicationStatus, DemandeSubvention } from "dto";
import SubventiaDto from "./@types/subventia.dto";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { ENTITIES, SUBVENTIA_DBO } from "./__fixtures__/subventia.fixture";
import Siren from "../../../identifierObjects/Siren";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { ReadableStream } from "node:stream/web";
import { ENTITY } from "../../applicationFlat/__fixtures__";
jest.mock("../../applicationFlat/applicationFlat.service");
jest.mock("./adapters/subventia.adapter");
jest.mock("../../../dataProviders/db/providers/subventia/subventia.port");

describe("Subventia Service", () => {
    const filePath = "path/to/file";

    const DEFAUT_REF = {
        "SIRET - Demandeur": "12345678911234",
        "Montant Ttc": 100,
        "Référence administrative - Demande": "ref1",
    };

    const ref1_value1 = { ...DEFAUT_REF };
    const ref1_value2 = { ...DEFAUT_REF, "Montant Ttc": 300 };
    const ref1_value3 = { ...DEFAUT_REF, "Montant Ttc": 200 };
    const ref2_value1 = { ...DEFAUT_REF, "Référence administrative - Demande": "ref2", "Montant Ttc": 200 };

    const parsedData = [ref1_value1, ref2_value1, ref1_value2] as SubventiaDto[];

    const applicationLines = [ref1_value1, ref1_value2, ref1_value3];

    const groupedData = {
        ref1: [ref1_value1, ref1_value2],
        ref2: [ref2_value1],
    };

    const sortedData = { valids: parsedData, invalids: [] };

    const exportDate = new Date("02/07/2023");

    const applications = [
        {
            siret: "12345678911234",
            reference_demande: "ref1",
            montants_demande: 400,
            provider: "subventia",
            exportDate: exportDate,
            __data__: [ref1_value1, ref1_value2],
        },
        {
            siret: "12345678911234",
            reference_demande: "ref2",
            montants_demande: 200,
            provider: "subventia",
            exportDate: exportDate,
            __data__: [ref2_value1],
        },
    ] as SubventiaDbo[];

    // @ts-expect-error: mock
    const rawGrant = applications.map(grant => ({
        provider: "subventia",
        type: "application",
        data: grant,
    })) as RawGrant[];

    let mockFindBySiret: jest.SpyInstance;
    let mockFindBySiren: jest.SpyInstance;
    let mockToDemandeSubventionDto: jest.SpyInstance;
    let mockToCommon: jest.SpyInstance;
    let mockCreate: jest.SpyInstance;

    beforeAll(() => {
        mockFindBySiret = jest.spyOn(SubventiaPort, "findBySiret").mockResolvedValue(applications);
        mockFindBySiren = jest.spyOn(SubventiaPort, "findBySiren").mockResolvedValue(applications);
        //@ts-expect-error : resolved value type not valid
        mockCreate = jest.spyOn(SubventiaPort, "create").mockResolvedValue("FAKE_ID");
        mockToDemandeSubventionDto = jest
            .spyOn(SubventiaAdapter, "toDemandeSubventionDto")
            .mockImplementation(data => data as unknown as DemandeSubvention);
        mockToCommon = jest
            .spyOn(SubventiaAdapter, "toCommon")
            .mockImplementation(data => data as unknown as CommonApplicationDto);
    });

    afterAll(() => {
        mockFindBySiret.mockReset();
        mockFindBySiren.mockReset();
        mockToDemandeSubventionDto.mockReset();
        mockCreate.mockRestore();
        mockToCommon.mockRestore();
    });

    describe("groupByApplication", () => {
        it("should group by Référence administrative - Demande", () => {
            const expected = groupedData;
            //@ts-expect-error : test private method
            const actual = subventiaService.groupByApplication(parsedData);
            expect(actual).toEqual(expected);
        });
    });

    describe("mergeToApplication", () => {
        it("should return the sum of the amount", () => {
            const expected = {
                "SIRET - Demandeur": "12345678911234",
                "Montant Ttc": 600,
                "Référence administrative - Demande": "ref1",
            };
            //@ts-expect-error : test private method
            const actual = subventiaService.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });

        it("should return the sum of the amount considering null values as zeros", () => {
            const applicationLinesWithNullAmount = [ref1_value1, ref1_value2, { ...ref1_value3, "Montant Ttc": null }];
            const expected = {
                "SIRET - Demandeur": "12345678911234",
                "Montant Ttc": 400,
                "Référence administrative - Demande": "ref1",
            };
            //@ts-expect-error : test private method
            const actual = subventiaService.mergeToApplication(applicationLinesWithNullAmount);
            expect(actual).toEqual(expected);
        });
    });

    describe("getApplications", () => {
        let mockGroupByApplication: jest.SpyInstance;
        let mockMergeToApplication: jest.SpyInstance;
        let mockApplicationToEntity: jest.SpyInstance;
        beforeAll(() => {
            //@ts-expect-error : test private method
            mockGroupByApplication = jest.spyOn(subventiaService, "groupByApplication").mockReturnValue(groupedData);
            //@ts-expect-error : test private method
            mockMergeToApplication = jest.spyOn(subventiaService, "mergeToApplication").mockReturnValue(ref1_value1);

            mockApplicationToEntity = jest.spyOn(SubventiaAdapter, "applicationToEntity").mockReturnValue({
                reference_demande: "ref1",
                service_instructeur: "CIPDR",
                annee_demande: 2023,
                siret: "123456789",
                date_commission: new Date("12/07/2023"),
                montants_accorde: 100,
                montants_demande: 600,
                dispositif: "FIPDR",
                sous_dispositif: "",
                status: "Refused",
                statut_label: ApplicationStatus.REFUSED,
                provider: "subventia",
                exportDate: exportDate,
            });
        });

        afterAll(() => {
            mockGroupByApplication.mockRestore();
            mockMergeToApplication.mockRestore();
            mockApplicationToEntity.mockRestore();
        });

        it("should call groupByApplication", () => {
            ///@ts-expect-error : test private method
            subventiaService.getApplications(parsedData, exportDate);
            expect(mockGroupByApplication).toHaveBeenCalledWith(parsedData);
        });

        it("should call mergeToApplication", () => {
            //@ts-expect-error : test private method
            subventiaService.getApplications(parsedData, exportDate);
            expect(mockMergeToApplication).toHaveBeenCalledTimes(2);
        });

        it("should call applicationToEntity", () => {
            //@ts-expect-error : test private method
            subventiaService.getApplications(parsedData, exportDate);
            expect(mockApplicationToEntity).toHaveBeenCalledTimes(2);
        });

        it("should return applications", () => {
            mockApplicationToEntity.mockReturnValueOnce({
                reference_demande: "ref1",
                montants_demande: 400,
                provider: "subventia",
                exportDate: exportDate,
                siret: "12345678911234",
            });
            mockApplicationToEntity.mockReturnValueOnce({
                reference_demande: "ref2",
                montants_demande: 200,
                provider: "subventia",
                exportDate: exportDate,
                siret: "12345678911234",
            });

            const expected = applications;
            //@ts-expect-error : test private method
            const actual = subventiaService.getApplications(parsedData, exportDate);

            expect(actual).toEqual(expected);
        });
    });

    describe("processSubventiaData", () => {
        let mockParse: jest.SpyInstance;
        let mockSortData: jest.SpyInstance;
        let mockGetApplications: jest.SpyInstance;

        beforeAll(() => {
            mockParse = jest.spyOn(SubventiaParser, "parse").mockReturnValue(parsedData);
            mockSortData = jest
                .spyOn(SubventiaValidator, "sortDataByValidity")
                .mockReturnValue({ valids: parsedData, invalids: [] });
            //@ts-expect-error : test private method
            mockGetApplications = jest.spyOn(subventiaService, "getApplications").mockReturnValue(applications);
        });

        afterAll(() => {
            mockParse.mockRestore();
            mockSortData.mockRestore();
            mockGetApplications.mockRestore();
        });

        it("should call parse", () => {
            subventiaService.processSubventiaData(filePath, exportDate);
            expect(mockParse).toHaveBeenCalledWith(filePath);
        });

        it("should call sortDataByValidity", () => {
            subventiaService.processSubventiaData(filePath, exportDate);
            expect(mockSortData).toHaveBeenCalledWith(parsedData);
        });

        it("should call getApplications", () => {
            subventiaService.processSubventiaData(filePath, exportDate);
            expect(mockGetApplications).toHaveBeenCalledWith(sortedData["valids"], exportDate);
        });

        it("should return applications and invalidsData", () => {
            const expected = { applications, invalids: [] };
            const actual = subventiaService.processSubventiaData(filePath, exportDate);
            expect(actual).toEqual(expected);
        });
    });
    describe("createEntity", () => {
        const entity = {
            name: "I'm subventia entity",
        } as unknown as SubventiaDbo;

        it("should call create", async () => {
            await subventiaService.createEntity(entity);
            expect(mockCreate).toHaveBeenCalledWith(entity);
        });
    });

    /**
     * |-------------------------|
     * |   Demande Part          |
     * |-------------------------|
     */

    describe("getDemandeSubvention", () => {
        const SIREN = new Siren("123456789");
        const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
        it("should call findBySiren", async () => {
            await subventiaService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            expect(mockFindBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should call toDemandeSubventionDto for each result", async () => {
            await subventiaService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            expect(mockToDemandeSubventionDto).toHaveBeenCalledTimes(2);
        });

        it("should return subventions", async () => {
            const actual = await subventiaService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            const expected = applications;
            expect(actual).toEqual(expected);
        });
    });

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    describe("getRawGrants", () => {
        const SIREN = new Siren("123456789");
        const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
        it("should call findBySiren", async () => {
            await subventiaService.getRawGrants(ASSOCIATION_IDENTIFIER);
            expect(mockFindBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should return raw grants", async () => {
            const actual = await subventiaService.getRawGrants(ASSOCIATION_IDENTIFIER);
            const expected = rawGrant;
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToCommon", () => {
        it("should call toCommon", () => {
            subventiaService.rawToCommon(rawGrant[0]);
            expect(mockToCommon).toHaveBeenCalledWith(rawGrant[0]["data"]);
        });
    });

    describe("rawToApplication", () => {
        const RAW_APPLICATION: RawApplication<SubventiaEntity> = {
            data: ENTITIES[0],
            type: "application",
            provider: "subventia",
            joinKey: undefined,
        };
        it("should call adapter rawToApplication", () => {
            subventiaService.rawToApplication(RAW_APPLICATION);
            expect(SubventiaAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });
    });

    /**
     * |---------------------------|
     * |   Application Flat Part   |
     * |---------------------------|
     */

    describe("saveFlatFromStream", () => {
        it("sends stream to save applications", () => {
            const STREAM = ReadableStream.from([]);
            subventiaService.saveFlatFromStream(STREAM);
            expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("initApplicationFlat", () => {
        let mockFindAll: jest.SpyInstance;
        let mockToApplicationFlat: jest.SpyInstance;
        let mockSaveFlatFromStream: jest.SpyInstance;

        beforeEach(() => {
            mockFindAll = jest.spyOn(SubventiaPort, "findAll").mockResolvedValue([SUBVENTIA_DBO]);
            mockToApplicationFlat = jest.spyOn(SubventiaAdapter, "toApplicationFlat").mockReturnValue(ENTITY);
            mockSaveFlatFromStream = jest.spyOn(subventiaService, "saveFlatFromStream").mockImplementation(jest.fn());
        });

        afterAll(() => mockSaveFlatFromStream.mockRestore());

        it("fetches subventia dbos", async () => {
            await subventiaService.initApplicationFlat();
            expect(mockFindAll).toHaveBeenCalled();
        });

        it("adapts dbo to application flat", async () => {
            await subventiaService.initApplicationFlat();
            expect(mockToApplicationFlat).toHaveBeenCalledWith(SUBVENTIA_DBO);
        });

        it("calls saveFlatFromStream", async () => {
            await subventiaService.initApplicationFlat();
            // const STREAM = ReadableStream.from([{ ...ENTITY, updateDate: expect.any(Date) }]); // could not find a way to make this work
            expect(mockSaveFlatFromStream.mock.calls[0][0]).toBeInstanceOf(ReadableStream);
        });
    });
});
