import { depositLogStore } from "$lib/store/depositLog.store";
import type { UploadedFileInfosDto } from "dto";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import ConfirmDataAddController from "./ConfirmDataAdd.controller";
import type { MockInstance } from "vitest";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("$lib/resources/deposit-log/depositLog.service");

describe("ConfirmDataAddController", () => {
    let controller: ConfirmDataAddController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set addedLines", async () => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    parseableLines: 165,
                    grantCoverageYears: [2025, 2024],
                    existingLinesInDbOnSamePeriod: 654,
                } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new ConfirmDataAddController();

            expect(controller.addedLines).toBe(165);
        });

        it("should set existingLinesInDb", async () => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    parseableLines: 165,
                    grantCoverageYears: [2025, 2024],
                    existingLinesInDbOnSamePeriod: 654,
                } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new ConfirmDataAddController();

            expect(controller.existingLinesInDb).toBe(654);
        });

        it("should set rangeStartYear", async () => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    parseableLines: 165,
                    grantCoverageYears: [2025, 2024],
                    existingLinesInDbOnSamePeriod: 654,
                } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new ConfirmDataAddController();

            expect(controller.rangeStartYear).toBe(2024);
        });

        it("should set rangeEndYear", async () => {
            depositLogStore.value = {
                uploadedFileInfos: {
                    parseableLines: 165,
                    grantCoverageYears: [2025, 2024],
                    existingLinesInDbOnSamePeriod: 654,
                } as UploadedFileInfosDto,
                step: 1,
            };

            controller = new ConfirmDataAddController();

            expect(controller.rangeEndYear).toBe(2025);
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

            controller = new ConfirmDataAddController();
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
