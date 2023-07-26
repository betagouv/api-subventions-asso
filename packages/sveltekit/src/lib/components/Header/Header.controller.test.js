import HeaderController from "./Header.controller";
import * as routerService from "$lib/services/router.service";

describe("HeaderController", () => {
    let controller;

    beforeEach(() => {
        controller = new HeaderController();
    });

    describe("goToProfile()", () => {
        const routerServiceMock = jest.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(null);
            controller.goToProfile();

            expect(routerServiceMock).toHaveBeenCalledWith("/user/profile");
        });
    });
});
