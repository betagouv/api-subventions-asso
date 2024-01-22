import HeaderController from "./Header.controller";
import * as routerService from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";

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
});
