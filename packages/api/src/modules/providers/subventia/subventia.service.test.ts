import subventiaService from "./subventia.service";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import SubventiaRepository from "./repositories/subventia.repository";
import SubventiaEntity, { SubventiaDbo } from "./@types/subventia.entity";
import { CommonApplicationDto, ApplicationStatus, DemandeSubvention } from "dto";
import SubventiaDto from "./@types/subventia.dto";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { ENTITIES } from "./__fixtures__/subventia.fixture";

jest.mock("./adapters/subventia.adapter");

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
        mockFindBySiret = jest.spyOn(SubventiaRepository, "findBySiret").mockResolvedValue(applications);
        mockFindBySiren = jest.spyOn(SubventiaRepository, "findBySiren").mockResolvedValue(applications);
        //@ts-expect-error : resolved value type not valid
        mockCreate = jest.spyOn(SubventiaRepository, "create").mockResolvedValue("FAKE_ID");
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
            expect(actual).toEqual(groupedData);
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

    describe("getDemandeSubventionBySiret", () => {
        const siret = "123456789";
        it("should call findBySiret", async () => {
            await subventiaService.getDemandeSubventionBySiret(siret);
            expect(mockFindBySiret).toHaveBeenCalledWith(siret);
        });

        it("should call toDemandeSubventionDto for each result", async () => {
            await subventiaService.getDemandeSubventionBySiret(siret);
            expect(mockToDemandeSubventionDto).toHaveBeenCalledTimes(2);
        });

        it("should return subventions", async () => {
            const actual = await subventiaService.getDemandeSubventionBySiret(siret);
            const expected = applications;
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const siren = "123456789";
        it("should call findBySiren", async () => {
            await subventiaService.getDemandeSubventionBySiret(siren);
            expect(mockFindBySiret).toHaveBeenCalledWith(siren);
        });

        it("should call toDemandeSubventionDto for each result", async () => {
            await subventiaService.getDemandeSubventionBySiret(siren);
            expect(mockToDemandeSubventionDto).toHaveBeenCalledTimes(2);
        });

        it("should return subventions", async () => {
            const actual = await subventiaService.getDemandeSubventionBySiret(siren);
            const expected = applications;
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await subventiaService.getDemandeSubventionByRna();
            expect(expected).toBe(actual);
        });
    });

    /**
     * |-------------------------|
     * |   Raw Grant Part        |
     * |-------------------------|
     */

    describe("getRawGrantsBySiret", () => {
        it("should call findBySiret", async () => {
            await subventiaService.getRawGrantsBySiret("FAKE_SIRET");
            expect(mockFindBySiret).toHaveBeenCalledWith("FAKE_SIRET");
        });

        it("should return raw grants", async () => {
            const actual = await subventiaService.getRawGrantsBySiret("FAKE_SIRET");
            const expected = rawGrant;
            expect(actual).toEqual(expected);
        });
    });

    describe("getRawGrantsBySiren", () => {
        it("should call findBySiren", async () => {
            await subventiaService.getRawGrantsBySiren("FAKE_SIREN");
            expect(mockFindBySiren).toHaveBeenCalledWith("FAKE_SIREN");
        });

        it("should return raw grants", async () => {
            const actual = await subventiaService.getRawGrantsBySiren("FAKE_SIREN");
            const expected = rawGrant;
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToCommon", () => {
        it("should call toCommon", () => {
            const actual = subventiaService.rawToCommon(rawGrant[0]);
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
});
