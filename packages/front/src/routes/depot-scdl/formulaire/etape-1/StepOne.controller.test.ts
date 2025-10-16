import StepOneController from "./StepOne.controller";
import * as routerService from "$lib/services/router.service";

vi.mock("$lib/resources/auth/auth.service");

describe("StepOneController", () => {
    let controller: StepOneController;

    beforeEach(() => {
        controller = new StepOneController();
    });

    describe("goToStep2()", () => {
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(undefined);
            controller.goToStep2();

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl/formulaire/etape-2");
        });
    });

    describe("goToDepositWelcomePage()", () => {
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(undefined);
            controller.goToDepositWelcomePage();

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl");
        });
    });
});
