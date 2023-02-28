import * as routerService from "../../services/router.service";
import HeaderController from "./Header.controller";
import authService from "@resources/auth/auth.service";

describe("HeaderController", () => {
    let controller;

    beforeEach(() => {
        controller = new HeaderController();
    });

    describe("logout", () => {
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

            expect(routerServiceMock).toHaveBeenCalledTimes(1);
        });
    });
});
