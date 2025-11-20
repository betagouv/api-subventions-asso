import { depositLogStore } from "$lib/store/depositLog.store";
import LessGrantDataController from "./LessGrantData.controller";
import type { UploadedFileInfosDto } from "dto";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("$lib/resources/deposit-log/depositLog.service");

describe("MultipleAllocatorsController", () => {
    let controller: LessGrantDataController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set rangeStartYear with min value", async () => {
            depositLogStore.value = {
                uploadedFileInfos: { grantCoverageYears: [2019, 2020, 2017] } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new LessGrantDataController();

            expect(controller.rangeStartYear).toBe(2017);
        });

        it("should set rangeEndYear with max value", async () => {
            depositLogStore.value = {
                uploadedFileInfos: { grantCoverageYears: [2019, 2020, 2017] } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new LessGrantDataController();

            expect(controller.rangeEndYear).toBe(2020);
        });

        it("should set detectedLines with uploadedFileInfos", async () => {
            depositLogStore.value = {
                uploadedFileInfos: { grantCoverageYears: [2019], parseableLines: 123 } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new LessGrantDataController();

            expect(controller.detectedLines).toBe(123);
        });

        it("should set existingLinesInDb with uploadedFileInfos", async () => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    grantCoverageYears: [2019],
                    existingLinesInDbOnSamePeriod: 456,
                } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new LessGrantDataController();

            expect(controller.existingLinesInDb).toBe(456);
        });
    });

    describe("functions", () => {
        const getGrantCsvMock = vi.spyOn(depositLogService, "getGrantCsv");
        let createObjectURLMock: ReturnType<typeof vi.fn>;
        let revokeObjectURLMock: ReturnType<typeof vi.fn>;

        let mockLink: Partial<HTMLAnchorElement>;

        beforeEach(() => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    grantCoverageYears: [2019],
                    existingLinesInDbOnSamePeriod: 456,
                } as UploadedFileInfosDto,
                step: 1,
            };

            createObjectURLMock = vi.fn().mockReturnValue("blob:created-url-for-csv-file-data");
            revokeObjectURLMock = vi.fn();

            Object.defineProperty(window, "URL", {
                value: {
                    createObjectURL: createObjectURLMock,
                    revokeObjectURL: revokeObjectURLMock,
                },
                writable: true,
            });

            mockLink = {
                href: "",
                download: "",
                click: vi.fn(),
            };

            vi.spyOn(document, "createElement").mockReturnValue(mockLink as HTMLAnchorElement);

            controller = new LessGrantDataController();
        });

        describe("downloadGrantsCsv", () => {
            it("should download csv file", async () => {
                const mockCsvData = "col1,col2,col3\ntoto,tata,1234\ntonton,tutu,4567";
                const mockFileName = "test.csv";

                getGrantCsvMock.mockResolvedValue({
                    csvData: mockCsvData,
                    fileName: mockFileName,
                });

                await controller.downloadGrantsCsv();

                expect(getGrantCsvMock).toHaveBeenCalledTimes(1);
                expect(createObjectURLMock).toHaveBeenCalledTimes(1);

                const blobCall = createObjectURLMock.mock.calls[0][0];
                expect(blobCall).toBeInstanceOf(Blob);
                expect(blobCall.type).toBe("text/csv; charset=utf-8");

                expect(mockLink.href).toBe("blob:created-url-for-csv-file-data");
                expect(mockLink.download).toBe(mockFileName);
                expect(mockLink.click).toHaveBeenCalledTimes(1);
                expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:created-url-for-csv-file-data");
            });
        });
    });
});
