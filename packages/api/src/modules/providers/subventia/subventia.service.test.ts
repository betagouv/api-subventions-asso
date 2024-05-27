import SubventiaService from "./subventia.service";
import SubventiaParser from "./subventia.parser";
import SubventiaValidator from "./validators/subventia.validator";
import SubventiaAdapter from "./adapters/subventiaAdapter";
import SubventiaRepository from "./repositories/subventia.repository";
import { SubventiaDbo } from "./@types/ISubventiaIndexedInformation";
import SubventiaLineEntity from "./entities/SubventiaLineEntity";

const filePath = "path/to/file";

describe("SubventiaService", () => {
    const ref1_value1 = { "Montant Ttc": 100, "Référence administrative - Demande": "ref1" };
    const ref1_value2 = { "Montant Ttc": 300, "Référence administrative - Demande": "ref1" };
    const ref1_value3 = { "Montant Ttc": 200, "Référence administrative - Demande": "ref1" };

    const ref2_value1 = { "Montant Ttc": 200, "Référence administrative - Demande": "ref2" };

    const parsedData = [ref1_value1, ref2_value1, ref1_value2];

    const applicationLines = [ref1_value1, ref1_value2, ref1_value3];

    const groupedData = {
        ref1: [ref1_value1, ref1_value2],
        ref2: [ref2_value1],
    };

    const entities = [
        {
            reference_demande: "ref1",
            service_instructeur: "CIPDR",
            annee_demande: 2023,
            siret: "123456789",
            date_commision: "12/07/2023",
            montants_accorde: 100,
            montants_demande: 400,
            dispositif: "FIPDR",
            sous_dispositif: "",
            status: "Refused",
        },
        {
            reference_demande: "ref2",
            service_instructeur: "CIPDR",
            annee_demande: 2023,
            siret: "123456789",
            date_commision: "12/07/2023",
            montants_accorde: 100,
            montants_demande: 200,
            dispositif: "FIPDR",
            sous_dispositif: "",
            status: "Refused",
        },
    ];

    const sortedData = { valids: parsedData, invalids: [] };

    describe("groupByApplication", () => {
        it("should group by Référence administrative - Demande", () => {
            const expected = groupedData;
            const actual = SubventiaService.groupByApplication(parsedData);
            expect(actual).toEqual(groupedData);
        });
    });

    describe("mergeToApplication", () => {
        it("should return the sum of the amount", () => {
            const expected = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" };
            const actual = SubventiaService.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });

        it("should return the sum of the amount considering null values as zeros", () => {
            const applicationLinesWithNullAmount = [ref1_value1, ref1_value2, { ...ref1_value3, "Montant Ttc": null }];
            const expected = { "Montant Ttc": 400, "Référence administrative - Demande": "ref1" };
            const actual = SubventiaService.mergeToApplication(applicationLinesWithNullAmount);
            expect(actual).toEqual(expected);
        });
    });

    describe("getApplications", () => {
        let mockGroupByApplication: jest.Mock;
        let mockMergeToApplication: jest.Mock;
        let mockApplicationToEntity: jest.Mock;
        beforeEach(() => {
            //@ts-expect-error : test private method
            mockGroupByApplication = jest.spyOn(SubventiaService, "groupByApplication");
            //@ts-expect-error : test private method
            mockMergeToApplication = jest.spyOn(SubventiaService, "mergeToApplication");

            //@ts-expect-error : test private method
            mockApplicationToEntity = jest.spyOn(SubventiaAdapter, "applicationToEntity");
        });

        afterAll(() => {
            mockGroupByApplication.mockRestore();
            mockMergeToApplication.mockRestore();
            mockApplicationToEntity.mockRestore();
        });

        it("should call groupByApplication", () => {
            SubventiaService.getApplications(parsedData);
            expect(mockGroupByApplication).toHaveBeenCalledWith(parsedData);
        });

        it("should call mergeToApplication", () => {
            SubventiaService.getApplications(parsedData);
            expect(mockMergeToApplication).toHaveBeenCalledTimes(2);
        });

        it("should call applicationToEntity", () => {
            SubventiaService.getApplications(parsedData);
            expect(mockApplicationToEntity).toHaveBeenCalledTimes(2);
        });

        it("should return applications", () => {
            mockApplicationToEntity.mockImplementation(() => {
                if (mockApplicationToEntity.mock.calls.length === 1) {
                    return { reference_demande: "ref1", montants_demande: 400 };
                } else {
                    return { reference_demande: "ref2", montants_demande: 200 };
                }
            });

            const expected = [
                {
                    reference_demande: "ref1",
                    montants_demande: 400,
                    __data__: [ref1_value1, ref1_value2],
                },
                {
                    reference_demande: "ref2",
                    montants_demande: 200,
                    __data__: [ref2_value1],
                },
            ];
            const actual = SubventiaService.getApplications(parsedData);

            expect(actual).toEqual(expected);
        });
    });

    describe("ProcessSubventiaData", () => {
        let mockParse: jest.SpyInstance;
        let mockSortData: jest.SpyInstance;
        let mockGetApplications: jest.SpyInstance;

        beforeEach(() => {
            mockParse = jest.spyOn(SubventiaParser, "parse").mockReturnValue(parsedData);
            mockSortData = jest
                .spyOn(SubventiaValidator, "sortDataByValidity")
                .mockReturnValue({ valids: parsedData, invalids: [] });
            mockGetApplications = jest.spyOn(SubventiaService, "getApplications");
        });

        afterAll(() => {
            mockParse.mockRestore();
            mockSortData.mockRestore();
            mockGetApplications.mockRestore();
        });

        it("should call parse", () => {
            SubventiaService.ProcessSubventiaData(filePath);
            expect(mockParse).toHaveBeenCalledWith(filePath);
        });

        it("should call sortDataByValidity", () => {
            SubventiaService.ProcessSubventiaData(filePath);
            expect(mockSortData).toHaveBeenCalledWith(parsedData);
        });

        it("should call getApplications", () => {
            SubventiaService.ProcessSubventiaData(filePath);
            expect(mockGetApplications).toHaveBeenCalledWith(sortedData["valids"]);
        });
    });

    describe("createEntity", () => {
        let mockCreate: jest.SpyInstance;

        const entity = {
            name: "I'm subventia entity",
        } as unknown as SubventiaLineEntity;

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
