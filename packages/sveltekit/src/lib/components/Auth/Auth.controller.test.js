import AuthController from "$lib/components/Auth/Auth.controller";
import authService from "$lib/resources/auth/auth.service";

describe("AuthController", () => {
    describe("init", () => {
        const authServiceMock = vi.spyOn(authService, "initUserInApp");

        let controller;

        beforeEach(() => {
            controller = new AuthController();
        });

        it("should be call authService", async () => {
            authServiceMock.mockReturnValueOnce({});

            await controller.init();

            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });
    });
});
