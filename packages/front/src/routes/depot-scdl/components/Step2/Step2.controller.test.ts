import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import Step2Controller from "./Step2.controller";
import type { DepositScdlLogResponseDto } from "dto";

const createDepositLogMock = vi.spyOn(depositLogService, "createDepositLog");
const updateDepositLogMock = vi.spyOn(depositLogService, "updateDepositLog");
vi.spyOn(depositLogStore, "set");

describe("Step2Controller", () => {
    let controller: Step2Controller;

    beforeEach(() => {
        controller = new Step2Controller();
        vi.clearAllMocks();
    });

    describe("handleValidate", () => {
        const allocatorSiret = "12345678901234";
        const mockDepositLog: DepositScdlLogResponseDto = {
            step: 1,
            overwriteAlert: true,
            allocatorSiret: allocatorSiret,
        };

        it("should create new depositLog if no existing deposit log", async () => {
            createDepositLogMock.mockResolvedValue(mockDepositLog);

            const result = await controller.handleValidate(allocatorSiret, null);

            expect(depositLogService.createDepositLog).toHaveBeenCalledWith({
                overwriteAlert: true,
                allocatorSiret: allocatorSiret,
            });
            expect(depositLogStore.set).toHaveBeenCalledWith(mockDepositLog);
            expect(result).toBe("success");
        });

        it("should update existing depositLog", async () => {
            updateDepositLogMock.mockResolvedValue(mockDepositLog);

            const result = await controller.handleValidate(allocatorSiret, mockDepositLog);

            const data = { allocatorSiret: allocatorSiret, overwriteAlert: true };

            expect(depositLogService.updateDepositLog).toHaveBeenCalledWith(1, data);
            expect(depositLogStore.set).toHaveBeenCalledWith(mockDepositLog);
            expect(result).toBe("success");
        });

        it("should return resume when 409 error", async () => {
            const error = {
                data: { code: 409, message: "Conflict" },
            };
            createDepositLogMock.mockRejectedValue(error);
            const result = await controller.handleValidate(allocatorSiret, null);

            expect(result).toBe("resume");
            expect(depositLogStore.set).not.toHaveBeenCalled();
        });

        it("should return resume when 400 error", async () => {
            const error = {
                data: { code: 400, message: "Bad Request" },
            };
            createDepositLogMock.mockRejectedValue(error);

            const result = await controller.handleValidate(allocatorSiret, null);

            expect(result).toBe("error");
            expect(depositLogStore.set).not.toHaveBeenCalled();
        });
    });
});
