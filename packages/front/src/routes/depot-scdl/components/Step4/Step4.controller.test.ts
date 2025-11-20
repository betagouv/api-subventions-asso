import Step4Controller from "./Step4.controller";

vi.mock("svelte", () => ({
    getContext: vi.fn(),
}));

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("$lib/resources/deposit-log/depositLog.service");

import { getContext } from "svelte";
import { depositLogStore } from "$lib/store/depositLog.store";
import { type UploadedFileInfosDto } from "dto";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

describe("Step4Controller", () => {
    let controller: Step4Controller;
    let mockDispatch: ReturnType<typeof vi.fn>;
    let mockApp;

    beforeEach(() => {
        mockDispatch = vi.fn();
        mockApp = {
            getContact: vi.fn().mockReturnValue("test@example.com"),
        };
        vi.mocked(getContext).mockReturnValue(mockApp);
        vi.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set view to error when uploadedFileInfos is undefined", async () => {
            depositLogStore.value = { uploadedFileInfos: undefined, step: 1 };

            controller = new Step4Controller(mockDispatch);

            expect(controller.view.value).toBe("error");
        });

        it("should set view to multipleAllocator when multiple allocators", () => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {
                    allocatorsSiret: ["12345678901234", "98765432109876"],
                    errors: [],
                } as unknown as UploadedFileInfosDto,
            };

            controller = new Step4Controller(mockDispatch);

            expect(controller.view.value).toBe("multipleAllocator");
        });

        it("should set view to multipleAllocator when allocator siret mismatch", () => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {
                    allocatorsSiret: ["98765432109876"],
                    errors: [],
                } as unknown as UploadedFileInfosDto,
            };

            controller = new Step4Controller(mockDispatch);

            expect(controller.view.value).toBe("multipleAllocator");
        });

        it("should set view to lessGrantData when less grant data than in db", () => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {
                    allocatorsSiret: ["12345678901234"],
                    parseableLines: 123,
                    existingLinesInDbOnSamePeriod: 124,
                    errors: [],
                } as unknown as UploadedFileInfosDto,
            };

            controller = new Step4Controller(mockDispatch);

            expect(controller.view.value).toBe("lessGrantData");
        });

        it("should set view to blockingErrors when blocking errors", () => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {
                    allocatorsSiret: ["12345678901234"],
                    parseableLines: 123,
                    existingLinesInDbOnSamePeriod: 123,
                    errors: [{ bloquant: "oui" }],
                } as unknown as UploadedFileInfosDto,
            };

            controller = new Step4Controller(mockDispatch);

            expect(controller.view.value).toBe("blockingErrors");
        });

        it("should set view to confirmDataAdd everything ok", () => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {
                    allocatorsSiret: ["12345678901234"],
                    parseableLines: 123,
                    existingLinesInDbOnSamePeriod: 123,
                    errors: [{ bloquant: "non" }],
                } as unknown as UploadedFileInfosDto,
            };

            controller = new Step4Controller(mockDispatch);

            expect(controller.view.value).toBe("confirmDataAdd");
        });
    });

    describe("functions", () => {
        beforeEach(() => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {
                    allocatorsSiret: ["12345678901234"],
                    parseableLines: 123,
                    existingLinesInDbOnSamePeriod: 123,
                    errors: [{ bloquant: "non" }],
                } as unknown as UploadedFileInfosDto,
            };

            controller = new Step4Controller(mockDispatch);
        });

        describe("contactEmail getter", () => {
            it("should return contact email from app", () => {
                expect(controller.contactEmail).toBe("test@example.com");
                expect(mockApp.getContact).toHaveBeenCalled();
            });
        });

        describe("handlePrevStep", () => {
            it("should call dispatch with prevStep", () => {
                controller.handlePrevStep();
                expect(mockDispatch).toHaveBeenCalledWith("prevStep");
                expect(mockDispatch).toHaveBeenCalledTimes(1);
            });
        });

        describe("handleRestartNewForm", () => {
            it("should call dispatch with restartNewForm", () => {
                controller.handleRestartNewForm();
                expect(mockDispatch).toHaveBeenCalledWith("restartNewForm");
                expect(mockDispatch).toHaveBeenCalledTimes(1);
            });
        });

        describe("submitDatas", () => {
            beforeEach(() => {
                Object.defineProperty(controller, "MIN_LOADING_TIME", {
                    value: 0,
                    writable: true,
                });
            });

            const persistScdlFileMock = vi.spyOn(depositLogService, "persistScdlFile");
            it("should call disptach with endLoading when error throws by service", async () => {
                persistScdlFileMock.mockRejectedValue(new Error("Error"));
                await controller.submitDatas();
                expect(mockDispatch).toHaveBeenCalledWith("endLoading");
            });

            it("should call dispatch with loading", async () => {
                persistScdlFileMock.mockResolvedValue();
                await controller.submitDatas();
                expect(mockDispatch).toHaveBeenCalledWith(
                    "loading",
                    "Veuillez patientez, nous finalisons le dépôt de vos données",
                );
            });

            it("should reset depositLogStore value", async () => {
                persistScdlFileMock.mockResolvedValue();
                await controller.submitDatas();
                expect(depositLogStore.value).toBeNull();
            });

            it("should call dispatch with nextStep", async () => {
                persistScdlFileMock.mockResolvedValue();
                await controller.submitDatas();
                expect(mockDispatch).toHaveBeenCalledWith("nextStep");
                expect(mockDispatch).toHaveBeenCalledTimes(2);
            });
        });
    });
});
