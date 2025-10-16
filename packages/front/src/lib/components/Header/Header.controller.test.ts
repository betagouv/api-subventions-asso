import HeaderController from "./Header.controller";
import * as routerService from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { DepositScdlLogResponseDto } from "dto";
import UnauthorizedError from "../../errors/UnauthorizedError";

vi.mock("$lib/resources/auth/auth.service");

describe("HeaderController", () => {
    let controller;

    beforeEach(() => {
        controller = new HeaderController();
    });

    describe("logout()", () => {
        it("should call logout", () => {
            controller.logout();
            expect(authService.logout).toHaveBeenCalled();
        });
    });

    describe("goToProfile()", () => {
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(null);
            controller.goToProfile();

            expect(routerServiceMock).toHaveBeenCalledWith("/user/profile");
        });
    });

    describe("goToBeginOrResumeDeposit()", () => {
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");
        const depositLogServiceMock = vi.spyOn(depositLogService, "getDepositLog");

        it("should call goToUrl", async () => {
            depositLogServiceMock.mockResolvedValue({} as DepositScdlLogResponseDto);
            routerServiceMock.mockReturnValue(undefined);
            await controller.goToBeginOrResumeDeposit();

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl/reprise");
        });

        it("should call goToUrl when no depositLog", async () => {
            depositLogServiceMock.mockResolvedValue(null);
            routerServiceMock.mockReturnValue(undefined);
            await controller.goToBeginOrResumeDeposit();

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl");
        });

        it("should call goToUrl when unauthorized error", async () => {
            depositLogServiceMock.mockRejectedValue(new UnauthorizedError({ message: "err message", code: 401 }));
            routerServiceMock.mockReturnValue(undefined);
            await controller.goToBeginOrResumeDeposit();

            expect(routerServiceMock).toHaveBeenCalledWith("/auth/login");
        });
    });
});
