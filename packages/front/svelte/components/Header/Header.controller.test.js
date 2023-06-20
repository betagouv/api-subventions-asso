import * as routerService from "../../services/router.service";
import HeaderController from "./Header.controller";

describe("HeaderController", () => {
    let controller;

    beforeEach(() => {
        controller = new HeaderController();
    });

    describe("goToProfil()", () => {
        const routerServiceMock = jest.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(null);
            controller.goToProfil();

            expect(routerServiceMock).toHaveBeenCalledWith("/user/profile");
        });
    });
});
