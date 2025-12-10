import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import Step2Controller from "./Step2.controller";
import type { DepositScdlLogResponseDto } from "dto";

vi.mock("$lib/resources/deposit-log/depositLog.service");

describe("Step2Controller", () => {
    const SIRET = "12345678901234";
    const DEPOSIT_LOG: DepositScdlLogResponseDto = {
        step: 1,
        overwriteAlert: true,
        allocatorSiret: SIRET,
    };
    let controller: Step2Controller;
    const createDepositLogMock = vi.spyOn(depositLogService, "createDepositLog");
    const updateDepositLogMock = vi.spyOn(depositLogService, "updateDepositLog");
    const mockSet = vi.spyOn(depositLogStore, "set");

    beforeEach(() => {
        controller = new Step2Controller();
        controller.inputValue.set(SIRET);
        depositLogStore.set(null);
    });

    describe("handleValidate", () => {
        beforeEach(() => {
            createDepositLogMock.mockResolvedValue(DEPOSIT_LOG);
            updateDepositLogMock.mockResolvedValue(DEPOSIT_LOG);
        });

        it("should return sucess", async () => {
            const expected = "success";
            const actual = await controller.handleValidate();
            expect(actual).toEqual(expected);
        });

        it("should create new depositLog if no existing deposit log", async () => {
            await controller.handleValidate();
            expect(depositLogService.createDepositLog).toHaveBeenCalledWith({
                overwriteAlert: true,
                allocatorSiret: SIRET,
            });
        });

        it("should update existing depositLog", async () => {
            depositLogStore.set(DEPOSIT_LOG);
            updateDepositLogMock.mockResolvedValue(DEPOSIT_LOG);

            controller.inputValue.set("98765432109876");

            await controller.handleValidate();
            const data = { allocatorSiret: "98765432109876", overwriteAlert: true };
            expect(depositLogService.updateDepositLog).toHaveBeenCalledWith(1, data);
        });

        it("should not call update depositLog if siret is the same", async () => {
            depositLogStore.set(DEPOSIT_LOG);
            updateDepositLogMock.mockResolvedValue(DEPOSIT_LOG);

            controller.inputValue.set("12345678901234");

            await controller.handleValidate();
            expect(depositLogService.updateDepositLog).not.toHaveBeenCalled();
        });

        it("should store deposit log", async () => {
            await controller.handleValidate();
            expect(mockSet).toHaveBeenCalledWith(DEPOSIT_LOG);
        });

        it("should return resume when 409 error", async () => {
            const expected = "resume";
            const error = {
                data: { code: 409, message: "Conflict" },
            };
            createDepositLogMock.mockRejectedValue(error);
            const actual = await controller.handleValidate();
            expect(actual).toBe(expected);
        });

        it("should return resume when 400 error", async () => {
            const expected = "error";
            const error = {
                data: { code: 400, message: "Bad Request" },
            };
            createDepositLogMock.mockRejectedValue(error);
            const actual = await controller.handleValidate();
            expect(actual).toBe(expected);
        });
    });

    describe("setTouch", () => {
        it("should set touched store", () => {
            const touched = true;
            const expected = touched;
            controller.setTouch(touched);
            const actual = controller.touched.value;
            expect(actual).toEqual(expected);
        });
    });
});
