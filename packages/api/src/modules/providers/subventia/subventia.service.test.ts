import SubventiaService from "./subventia.service";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventia.adapter";
import SubventiaRepository from "./repositories/subventia.repository";
import { SubventiaDbo } from "./@types/subventia.entity";
import { ApplicationStatus } from "dto";
import SubventiaDto from "./@types/subventia.dto";
import exp from "constants";

describe("SubventiaService", () => {
    const filePath = "path/to/file";

    const ref1_value1 = { "Montant Ttc": 100, "Référence administrative - Demande": "ref1" };
    const ref1_value2 = { "Montant Ttc": 300, "Référence administrative - Demande": "ref1" };
    const ref1_value3 = { "Montant Ttc": 200, "Référence administrative - Demande": "ref1" };

    const ref2_value1 = { "Montant Ttc": 200, "Référence administrative - Demande": "ref2" };

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
            reference_demande: "ref1",
            montants_demande: 400,
            provider: "subventia",
            exportDate: exportDate,
            __data__: [ref1_value1, ref1_value2],
        },
        {
            reference_demande: "ref2",
            montants_demande: 200,
            provider: "subventia",
            exportDate: exportDate,
            __data__: [ref2_value1],
        },
    ];

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
            const expected = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" };
            //@ts-expect-error : test private method
            const actual = SubventiaService.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });

        it("should return the sum of the amount considering null values as zeros", () => {
            const applicationLinesWithNullAmount = [ref1_value1, ref1_value2, { ...ref1_value3, "Montant Ttc": null }];
            const expected = { "Montant Ttc": 400, "Référence administrative - Demande": "ref1" };
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
                date_commision: new Date("12/07/2023"),
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
            });
            mockApplicationToEntity.mockReturnValueOnce({
                reference_demande: "ref2",
                montants_demande: 200,
                provider: "subventia",
                exportDate: exportDate,
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
        let mockCreate: jest.SpyInstance;

        const entity = {
            name: "I'm subventia entity",
        } as unknown as SubventiaDbo;

        //@ts-expect-error : test private method
        mockCreate = jest.spyOn(SubventiaRepository, "create").mockResolvedValue("FAKE_ID");
        afterAll(() => {
            mockCreate.mockRestore();
        });

        it("should call create", async () => {
            await SubventiaService.createEntity(entity);
            expect(mockCreate).toHaveBeenCalledWith(entity);
        });
    });
});
