import SubventiaService from "./subventia.service";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import SubventiaRepository from "./repositories/subventia.repository";
import { SubventiaDbo } from "./@types/subventia.entity";
import { ApplicationDto, ApplicationStatus, DemandeSubvention } from "dto";
import SubventiaDto from "./@types/subventia.dto";
import subventiaRepository from "./repositories/subventia.repository";
import { raw } from "express";
import { RawGrant } from "../../grant/@types/rawGrant";

describe("SubventiaService", () => {
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
            .mockImplementation(data => data as unknown as ApplicationDto);
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
            const actual = SubventiaService.groupByApplication(parsedData);
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
            const actual = SubventiaService.mergeToApplication(applicationLines);
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
            const actual = SubventiaService.mergeToApplication(applicationLinesWithNullAmount);
            expect(actual).toEqual(expected);
        });
    });

    describe("getApplications", () => {
        let mockGroupByApplication: jest.SpyInstance;
        let mockMergeToApplication: jest.SpyInstance;
        let mockApplicationToEntity: jest.SpyInstance;
        beforeAll(() => {
            //@ts-expect-error : test private method
            mockGroupByApplication = jest.spyOn(SubventiaService, "groupByApplication").mockReturnValue(groupedData);
            //@ts-expect-error : test private method
            mockMergeToApplication = jest.spyOn(SubventiaService, "mergeToApplication").mockReturnValue(ref1_value1);

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
            SubventiaService.getApplications(parsedData, exportDate);
            expect(mockGroupByApplication).toHaveBeenCalledWith(parsedData);
        });

        it("should call mergeToApplication", () => {
            //@ts-expect-error : test private method
            SubventiaService.getApplications(parsedData, exportDate);
            expect(mockMergeToApplication).toHaveBeenCalledTimes(2);
        });

        it("should call applicationToEntity", () => {
            //@ts-expect-error : test private method
            SubventiaService.getApplications(parsedData, exportDate);
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
            const actual = SubventiaService.getApplications(parsedData, exportDate);

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
            mockGetApplications = jest.spyOn(SubventiaService, "getApplications").mockReturnValue(applications);
        });

        afterAll(() => {
            mockParse.mockRestore();
            mockSortData.mockRestore();
            mockGetApplications.mockRestore();
        });

        it("should call parse", () => {
            SubventiaService.processSubventiaData(filePath, exportDate);
            expect(mockParse).toHaveBeenCalledWith(filePath);
        });

        it("should call sortDataByValidity", () => {
            SubventiaService.processSubventiaData(filePath, exportDate);
            expect(mockSortData).toHaveBeenCalledWith(parsedData);
        });

        it("should call getApplications", () => {
            SubventiaService.processSubventiaData(filePath, exportDate);
            expect(mockGetApplications).toHaveBeenCalledWith(sortedData["valids"], exportDate);
        });
    });
    describe("createEntity", () => {
        const entity = {
            name: "I'm subventia entity",
        } as unknown as SubventiaDbo;

        it("should call create", async () => {
            await SubventiaService.createEntity(entity);
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
            await SubventiaService.getDemandeSubventionBySiret(siret);
            expect(mockFindBySiret).toHaveBeenCalledWith(siret);
        });

        it("should call toDemandeSubventionDto for each result", async () => {
            await SubventiaService.getDemandeSubventionBySiret(siret);
            expect(mockToDemandeSubventionDto).toHaveBeenCalledTimes(2);
        });

        it("should return subventions", async () => {
            const actual = await SubventiaService.getDemandeSubventionBySiret(siret);
            const expected = applications;
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const siren = "123456789";
        it("should call findBySiren", async () => {
            await SubventiaService.getDemandeSubventionBySiret(siren);
            expect(mockFindBySiret).toHaveBeenCalledWith(siren);
        });

        it("should call toDemandeSubventionDto for each result", async () => {
            await SubventiaService.getDemandeSubventionBySiret(siren);
            expect(mockToDemandeSubventionDto).toHaveBeenCalledTimes(2);
        });

        it("should return subventions", async () => {
            const actual = await SubventiaService.getDemandeSubventionBySiret(siren);
            const expected = applications;
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await SubventiaService.getDemandeSubventionByRna();
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
            await SubventiaService.getRawGrantsBySiret("FAKE_SIRET");
            expect(mockFindBySiret).toHaveBeenCalledWith("FAKE_SIRET");
        });

        it("should return raw grants", async () => {
            const actual = await SubventiaService.getRawGrantsBySiret("FAKE_SIRET");
            const expected = rawGrant;
            expect(actual).toEqual(expected);
        });
    });

    describe("getRawGrantsBySiren", () => {
        it("should call findBySiren", async () => {
            await SubventiaService.getRawGrantsBySiren("FAKE_SIREN");
            expect(mockFindBySiren).toHaveBeenCalledWith("FAKE_SIREN");
        });

        it("should return raw grants", async () => {
            const actual = await SubventiaService.getRawGrantsBySiren("FAKE_SIREN");
            const expected = rawGrant;
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToCommon", () => {
        it("should call toCommon", () => {
            const actual = SubventiaService.rawToCommon(rawGrant[0]);
            expect(mockToCommon).toHaveBeenCalledWith(rawGrant[0]["data"]);
        });
    });
});
