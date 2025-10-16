import ResumeFormController from "./ResumeForm.controller";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";

const deleteDepositLogMock = vi.spyOn(depositLogService, "deleteDepositLog");
vi.spyOn(depositLogStore, "set");

describe("ResumeFormController", () => {
    let controller: ResumeFormController;

    beforeEach(() => {
        controller = new ResumeFormController();
        vi.clearAllMocks();
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
});
