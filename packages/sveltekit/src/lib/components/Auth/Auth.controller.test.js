import { page } from "$app/stores";
import AuthController from "$lib/components/Auth/Auth.controller";
import authService from "$lib/resources/auth/auth.service";

vi.mock("$app/stores", () => ({ page: { subscribe: vi.fn() } }));
vi.mock("$lib/resources/auth/auth.service");

describe("AuthController", () => {
    describe("init", () => {
        const authServiceMock = vi.spyOn(authService, "initUserInApp");

        let controller;

        beforeEach(() => {
            controller = new AuthController();
        });

        it("should call authService", async () => {
            vi.mocked(authService.initUserInApp).mockReturnValueOnce({});

            await controller.init();

            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });

        it("should subscribe page", async () => {
            vi.mocked(authService.initUserInApp).mockReturnValueOnce({});
            await controller.init();
            expect(page.subscribe).toHaveBeenCalledTimes(1);
        });

        it("page subscribe's callback calls controlAuth", async () => {
            vi.mocked(authService.initUserInApp).mockReturnValueOnce();
            await controller.init();
            const callback = vi.fn(vi.mocked(page.subscribe).mock.calls[0][0]);
            const PAGE = { data: { authLevel: 2 } };
            callback(PAGE);
            expect(authService.controlAuth).toHaveBeenCalledWith(2);
        });
    });
});
