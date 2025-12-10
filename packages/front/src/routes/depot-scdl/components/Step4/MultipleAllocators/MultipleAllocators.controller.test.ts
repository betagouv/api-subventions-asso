import { depositLogStore } from "$lib/store/depositLog.store";

vi.mock("$lib/stores/depositLogStore", () => ({
    depositLogStore: {
        value: null,
    },
}));

vi.mock("$lib/resources/deposit-log/depositLog.service");

import MultipleAllocatorsController from "./MultipleAllocators.controller";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { UploadedFileInfosDto } from "dto";

describe("MultipleAllocatorsController", () => {
    let controller: MultipleAllocatorsController;
    let mockDispatch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockDispatch = vi.fn();
        controller = new MultipleAllocatorsController(mockDispatch);
        vi.clearAllMocks();
    });

    describe("restartUploadFile", () => {
        it("should call dispatch with prevStep", () => {
            controller.restartUploadFile();
            expect(mockDispatch).toHaveBeenCalledWith("prevStep");
            expect(mockDispatch).toHaveBeenCalledTimes(1);
        });
    });

    describe("restartNewDeposit", () => {
        const deleteDepositLogMock = vi.spyOn(depositLogService, "deleteDepositLog");

        it("should call dispatch with restartNewForm", async () => {
            deleteDepositLogMock.mockResolvedValue(null);
            await controller.restartNewDeposit();
            expect(mockDispatch).toHaveBeenCalledWith("restartNewForm");
            expect(mockDispatch).toHaveBeenCalledTimes(1);
        });

        it("should reset depositLogStore", async () => {
            deleteDepositLogMock.mockResolvedValue(null);
            await controller.restartNewDeposit();
            expect(depositLogStore.value).toBeNull();
        });

        it("should not call disptach when service throw", async () => {
            deleteDepositLogMock.mockRejectedValue(new Error("Error"));
            await controller.restartNewDeposit();
            expect(mockDispatch).not.toHaveBeenCalled();
        });

        it("should not reset deposit log store when service throw", async () => {
            depositLogStore.value = {
                step: 1,
                allocatorSiret: "12345678901234",
                uploadedFileInfos: {} as unknown as UploadedFileInfosDto,
            };
            deleteDepositLogMock.mockRejectedValue(new Error("Error"));
            await controller.restartNewDeposit();
            expect(depositLogStore.value).not.toBeNull();
        });
    });
});
