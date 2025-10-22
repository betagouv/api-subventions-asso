import { page } from "$lib/store/kit.store";
import AuthController from "$lib/components/Auth/Auth.controller";
import authService from "$lib/resources/auth/auth.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { Page } from "@sveltejs/kit";

vi.mock("$lib/resources/deposit-log/depositLog.service");
vi.mock("$lib/store/kit.store", () => ({ page: { subscribe: vi.fn() } }));
vi.mock("$lib/resources/auth/auth.service");

describe("AuthController", () => {
    // @ts-expect-error: mock page value
    const PAGE = { data: { authLevel: AuthLevels.ADMIN } } as Page<Record<string, string>>;
    const mockSubscribe = vi.mocked(page.subscribe);

    describe("init", () => {
        const authServiceMock = vi.spyOn(authService, "initUserInApp").mockImplementation(vi.fn());

        let controller;

        beforeEach(() => {
            controller = new AuthController();
        });

        it("should call authService", async () => {
            await controller.init();
            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });

        it("gets deposits log", async () => {
            await controller.init();
            expect(vi.mocked(depositLogService.getDepositLog)).toHaveBeenCalledOnce();
        });

        it("should subscribe page", async () => {
            await controller.init();
            expect(mockSubscribe).toHaveBeenCalledTimes(1);
        });

        it("page subscribe's callback calls controlAuth", async () => {
            await controller.init();
            const callback = vi.mocked(mockSubscribe).mock.calls[0][0];
            callback(PAGE);
            expect(authService.controlAuth).toHaveBeenCalledWith(AuthLevels.ADMIN);
        });

        it("page subscribe's callback sets result from controlAuth in show store", async () => {
            vi.mocked(authService.controlAuth).mockReturnValueOnce(true);
            const showSetSpy = vi.spyOn(controller.show, "set");
            await controller.init();
            const callback = vi.mocked(mockSubscribe).mock.calls[0][0];
            callback(PAGE);
            expect(showSetSpy).toHaveBeenCalledWith(true);
        });
    });
});
