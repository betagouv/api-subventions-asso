import ResumeFormController from "./ResumeForm.controller";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import { expect, type MockInstance } from "vitest";
import type { UploadedFileInfosDto } from "dto";

let deleteDepositLogMock: MockInstance<() => Promise<null>>;
let downloadErrorFileMock: MockInstance<(fileInfos: UploadedFileInfosDto) => Promise<void>>;
let downloadScdlFileMock: MockInstance<(filename: string) => Promise<void>>;

describe("ResumeFormController", () => {
    beforeEach(() => {
        depositLogStore.value = {
            step: 2,
            permissionAlert: true,
            allocatorSiret: "12345678901234",
            overwriteAlert: true,
            uploadedFileInfos: {
                fileName: "test.csv",
                errors: [],
                parseableLines: 123,
                existingLinesInDbOnSamePeriod: 12,
                totalLines: 124,
                uploadDate: new Date(),
                grantCoverageYears: [2024],
                allocatorsSiret: ["12345678901234"],
            },
        };
        deleteDepositLogMock = vi.spyOn(depositLogService, "deleteDepositLog");
        downloadErrorFileMock = vi.spyOn(depositLogService, "downloadErrorFile");
        downloadScdlFileMock = vi.spyOn(depositLogService, "downloadScdlFile");
        vi.spyOn(depositLogStore, "set");
    });

    describe("constructor", () => {
        it("set allocatorSiret", () => {
            const controller = new ResumeFormController();
            expect(controller.allocatorSiret).toBe(depositLogStore.value?.allocatorSiret);
        });

        it("set fileInfos", () => {
            const controller = new ResumeFormController();
            expect(controller.fileInfos).toBe(depositLogStore.value?.uploadedFileInfos);
        });

        it("set filename", () => {
            const controller = new ResumeFormController();
            expect(controller.filename).toBe(depositLogStore.value?.uploadedFileInfos?.fileName);
        });

        it("set currentView with siretView if step 1", () => {
            depositLogStore.value = {
                step: 1,
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
            };
            const controller = new ResumeFormController();
            expect(controller.currentView).toBe("siretView");
        });
    });

    describe("functions", () => {
        let controller: ResumeFormController;

        beforeEach(() => {
            controller = new ResumeFormController();
        });

        describe("handleRestartDeposit", () => {
            it("should reinit deposit log", async () => {
                deleteDepositLogMock.mockResolvedValue(null);

                const result = await controller.handleRestartDeposit();

                expect(depositLogService.deleteDepositLog).toHaveBeenCalledTimes(1);
                expect(depositLogStore.set).toHaveBeenCalledWith(null);
                expect(result).toBe(true);
            });

            it("should return false if deleteDepositLog fails", async () => {
                const error = new Error("Fail");
                deleteDepositLogMock.mockRejectedValue(error);

                const result = await controller.handleRestartDeposit();

                expect(depositLogService.deleteDepositLog).toHaveBeenCalledTimes(1);
                expect(result).toBe(false);
            });

            it("should not call depositLogStore.set if deleteDepositLog fails", async () => {
                deleteDepositLogMock.mockRejectedValue(new Error("Fail"));

                await controller.handleRestartDeposit();

                expect(depositLogStore.set).not.toHaveBeenCalled();
            });
        });

        describe("downloadErrorFile", () => {
            it("call downloadErrorFile with params", async () => {
                downloadErrorFileMock.mockResolvedValue();

                await controller.downloadErrorFile();

                expect(depositLogService.downloadErrorFile).toHaveBeenCalledWith(
                    depositLogStore.value!.uploadedFileInfos!,
                );
            });
        });

        describe("generateDownloadUrl", () => {
            it("call downloadScdlFile with params", async () => {
                downloadScdlFileMock.mockResolvedValue();

                await controller.generateDownloadUrl();

                expect(depositLogService.downloadScdlFile).toHaveBeenCalledWith(
                    depositLogStore.value!.uploadedFileInfos?.fileName,
                );
            });
        });
    });
});
