import { depositLogStore } from "$lib/store/depositLog.store";
import LessGrantDataController from "./LessGrantData.controller";
import type { UploadedFileInfosDto } from "dto";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { MockInstance } from "vitest";

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
        const getGrantCsvMock = vi.spyOn(depositLogService, "getCsv");
        let createObjectURLMock: MockInstance<(blob: Blob) => string>;
        let revokeObjectURLMock: MockInstance<(url: string) => void>;

        let mockLink: Partial<HTMLAnchorElement>;

        beforeEach(() => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    grantCoverageYears: [2019],
                    existingLinesInDbOnSamePeriod: 456,
                } as UploadedFileInfosDto,
                step: 1,
            };

            createObjectURLMock = vi.fn<(blob: Blob) => string>().mockReturnValue("blob:created-url-for-csv-file-data");
            revokeObjectURLMock = vi.fn<(url: string) => void>();

            vi.stubGlobal("URL", {
                createObjectURL: createObjectURLMock,
                revokeObjectURL: revokeObjectURLMock,
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
            const mockCsvData = "col1,col2,col3\ntoto,tata,1234\ntonton,tutu,4567";
            const mockFileName = "test.csv";

            beforeEach(() => {
                getGrantCsvMock.mockResolvedValue({
                    csvData: mockCsvData,
                    fileName: mockFileName,
                });
            });

            it("creates a CSV blob with correct MIME type", async () => {
                await controller.downloadGrantsCsv();

                expect(createObjectURLMock).toHaveBeenCalledTimes(1);

                const blobCall = createObjectURLMock.mock.calls[0][0];
                expect(blobCall).toBeInstanceOf(Blob);
                expect(blobCall.type).toBe("text/csv; charset=utf-8");
            });

            it("triggers download of file", async () => {
                await controller.downloadGrantsCsv();

                expect(mockLink.href).toBe("blob:created-url-for-csv-file-data");
                expect(mockLink.download).toBe(mockFileName);
                expect(mockLink.click).toHaveBeenCalledTimes(1);
            });

            it("revokes blob url after download", async () => {
                await controller.downloadGrantsCsv();

                expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:created-url-for-csv-file-data");
            });
        });
    });
});
