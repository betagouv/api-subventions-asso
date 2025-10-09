import * as routerService from "$lib/services/router.service";
import StepTwoController from "./StepTwoController";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { CreateDepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import ConflictError from "../../../../lib/errors/ConflictError";

vi.mock("$lib/resources/auth/auth.service");

describe("StepTwoController", () => {
    let controller: StepTwoController;

    beforeEach(() => {
        controller = new StepTwoController();
    });

    describe("goToStep1()", () => {
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(undefined);
            controller.goToStep1();

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl/formulaire/etape-1");
        });
    });

    describe("onValidate()", () => {
        const depositLogServiceCreateMock = vi.spyOn(depositLogService, "createDepositLog");
        const depositLogServiceUpdateMock = vi.spyOn(depositLogService, "updateDepositLog");
        const depositLogServiceGetMock = vi.spyOn(depositLogService, "getDepositLog");
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");

        const inputValue = "12345678901234";
        const depositLog: CreateDepositScdlLogDto = {
            overwriteAlert: true,
            allocatorSiret: inputValue,
        };

        it("should call createDepositLog when deposit log don't exist", async () => {
            depositLogServiceCreateMock.mockResolvedValue({} as DepositScdlLogResponseDto);
            depositLogServiceGetMock.mockResolvedValue(null);
            routerServiceMock.mockReturnValue(undefined);
            await controller.onValidate(inputValue);

            expect(depositLogServiceCreateMock).toHaveBeenCalledWith(depositLog);
        });

        it("should sanitaze input", async () => {
            depositLogServiceCreateMock.mockResolvedValue({} as DepositScdlLogResponseDto);
            depositLogServiceGetMock.mockResolvedValue(null);
            routerServiceMock.mockReturnValue(undefined);
            await controller.onValidate("   123\t  45  \n 678\t90  \n  1234    ");

            expect(depositLogServiceCreateMock).toHaveBeenCalledWith(depositLog);
        });

        it("should call updateDepositLog when deposit log exist", async () => {
            depositLogServiceUpdateMock.mockResolvedValue({} as DepositScdlLogResponseDto);
            depositLogServiceGetMock.mockResolvedValue({} as DepositScdlLogResponseDto);
            routerServiceMock.mockReturnValue(undefined);
            await controller.onValidate(inputValue);

            expect(depositLogServiceUpdateMock).toHaveBeenCalledWith(1, depositLog);
        });

        it("should call goToUrl", async () => {
            depositLogServiceCreateMock.mockResolvedValue({} as DepositScdlLogResponseDto);
            depositLogServiceGetMock.mockResolvedValue(null);
            routerServiceMock.mockReturnValue(undefined);
            await controller.onValidate("12345678901234");

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl/formulaire/etape-3");
        });

        it("should should throw conflic error and goToUrl", async () => {
            depositLogServiceGetMock.mockResolvedValue(null);
            depositLogServiceCreateMock.mockRejectedValue(new ConflictError({ message: "err message", code: 409 }));
            routerServiceMock.mockReturnValue(undefined);
            await controller.onValidate("12345678901234");

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl/formulaire/reprise");
        });
    });
});
