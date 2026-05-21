import ResumeFormController from "./ResumeForm.controller";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import { expect, type MockInstance } from "vitest";
import type { UploadedFileInfosDto } from "dto";

let deleteDepositLogMock: MockInstance<() => Promise<null>>;
let downloadErrorFileMock: MockInstance<(fileInfos: UploadedFileInfosDto) => Promise<void>>;
let downloadScdlFileMock: MockInstance<(filename: string) => Promise<void>>;

vi.mock("$lib/resources/deposit-log/depositLog.service");

describe("ResumeFormController", () => {
    let controller;

    beforeEach(() => {
        depositLogStore.set({
            step: 2,
            permissionAlert: true,
            allocatorSiret: "12345678901234",
            uploadedFileInfos: {
                fileName: "test.csv",
                errorStats: { count: 0, errorSample: [] },
                parseableLines: 123,
                missingHeaders: { mandatory: [], optional: [] },
                existingLinesInDbOnSamePeriod: 12,
                totalLines: 124,
                lineCountsByExercice: [{ exercice: 2014, linesInDb: 12, parsedLines: 123 }],
                uploadDate: new Date(),
                grantCoverageYears: [2024],
                allocatorsSiret: ["12345678901234"],
            },
        });
        vi.spyOn(depositLogStore, "set");
        vi.mocked(depositLogStore.set).mockReset(); // remove first call
        deleteDepositLogMock = vi.spyOn(depositLogService, "deleteDepositLog");
        downloadErrorFileMock = vi.spyOn(depositLogService, "downloadErrorFile");
        downloadScdlFileMock = vi.spyOn(depositLogService, "downloadScdlFile");

        controller = new ResumeFormController();
    });

    describe("constructor", () => {
        it("set allocatorSiret", () => {
            expect(controller.allocatorSiret).toBe(depositLogStore.value?.allocatorSiret);
        });

        it("set fileInfos", () => {
            expect(controller.fileInfos).toBe(depositLogStore.value?.uploadedFileInfos);
        });

        it("set filename", () => {
            expect(controller.filename).toBe(depositLogStore.value?.uploadedFileInfos?.fileName);
        });

        it("set currentView with siretView if step 1", () => {
            depositLogStore.value = {
                step: 1,
                permissionAlert: true,
                allocatorSiret: "12345678901234",
            };
            // override deposit log value in controller
            controller = new ResumeFormController();
            expect(controller.currentView).toEqual("siretView");
        });
    });

    describe("functions", () => {
        describe("handleRestartDeposit", () => {
            it("returns true after reset", async () => {
                deleteDepositLogMock.mockResolvedValue(null);

                const result = await controller.handleRestartDeposit();

                expect(result).toEqual(true);
            });

            it("should reinit deposit log", async () => {
                deleteDepositLogMock.mockResolvedValue(null);

                await controller.handleRestartDeposit();

                expect(depositLogStore.set).toHaveBeenCalledWith(null);
            });

            it("should not call depositLogStore.set if deleteDepositLog fails", async () => {
                deleteDepositLogMock.mockRejectedValue(new Error("Fail"));

                await controller.handleRestartDeposit();
                expect(depositLogStore.set).not.toHaveBeenCalled();
            });

            it("should return false if deleteDepositLog fails", async () => {
                deleteDepositLogMock.mockRejectedValue(new Error("Fail"));

                const result = await controller.handleRestartDeposit();
                expect(result).toEqual(false);
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
