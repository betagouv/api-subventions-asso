import { ProfileController } from "./Profile.controller";
import * as routerService from "@services/router.service";
import authService from "@resources/auth/auth.service";
import userService from "@resources/users/user.service";
jest.mock("@resources/users/user.service");

describe("ProfileController", () => {
    let controller;

    beforeEach(() => (controller = new ProfileController()));

    describe("logout()", () => {
        const authServiceMock = jest.spyOn(authService, "logout");
        const routerServiceMock = jest.spyOn(routerService, "goToUrl");

        it("should call authService", () => {
            authServiceMock.mockReturnValueOnce({});
            routerServiceMock.mockReturnValue(null);

            controller.logout();

            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });

        it("should call goToUrl", () => {
            authServiceMock.mockReturnValueOnce(null);
            routerServiceMock.mockReturnValue(null);
            controller.logout();

            expect(routerServiceMock).toHaveBeenCalledWith("/auth/login");
        });
    });

    describe("deleteUser()", () => {
        it("should call userService.deleteCurrentUser()", () => {
            controller.deleteUser();
            expect(userService.deleteCurrentUser).toHaveBeenCalledTimes(1);
        });

        it("should call logout", () => {
            const spyLogout = jest.spyOn(controller, "logout");
            controller.deleteUser();
            expect(spyLogout).toHaveBeenCalledTimes(1);
        });
    });
});
