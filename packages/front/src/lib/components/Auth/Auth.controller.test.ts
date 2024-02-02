import { page } from "$lib/store/kit.store";
import AuthController from "$lib/components/Auth/Auth.controller";
import authService from "$lib/resources/auth/auth.service";
import AuthLevels from "$lib/resources/auth/authLevels";

vi.mock("$lib/store/kit.store", () => ({ page: { subscribe: vi.fn() } }));
vi.mock("$lib/resources/auth/auth.service");

describe("AuthController", () => {
    describe("init", () => {
        const authServiceMock = vi.spyOn(authService, "initUserInApp").mockImplementation(vi.fn);

        let controller;

        beforeEach(() => {
            controller = new AuthController();
        });

        it("should call authService", async () => {
            await controller.init();
            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });

        it("should subscribe page", async () => {
            await controller.init();
            expect(page.subscribe).toHaveBeenCalledTimes(1);
        });

        it("page subscribe's callback calls controlAuth", async () => {
            vi.mocked(authService.initUserInApp).mockReturnValueOnce();
            await controller.init();
            const callback = vi.fn(vi.mocked(page.subscribe).mock.calls[0][0]);
            const PAGE = { data: { authLevel: AuthLevels.ADMIN } };
            // @ts-expect-error: mock page data
            callback(PAGE);
            expect(authService.controlAuth).toHaveBeenCalledWith(2);
        });

        it("page subscribe's callback sets result from controlAuth in show store", async () => {
            vi.mocked(authService.initUserInApp).mockReturnValueOnce();
            vi.mocked(authService.controlAuth).mockReturnValueOnce(true);
            const showSetSpy = vi.spyOn(controller.show, "set");
            await controller.init();
            const callback = vi.fn(vi.mocked(page.subscribe).mock.calls[0][0]);
            const PAGE = { data: { authLevel: AuthLevels.ADMIN } };
            callback(PAGE);
            expect(showSetSpy).toHaveBeenCalledWith(true);
        });
    });
});
