import * as routerService from "$lib/services/router.service";
import DepositScdlController from "./DepositScdl.controller";

vi.mock("$lib/resources/auth/auth.service");

describe("DepositScdlController", () => {
    let controller: DepositScdlController;

    beforeEach(() => {
        controller = new DepositScdlController();
    });

    describe("goToStep1()", () => {
        const routerServiceMock = vi.spyOn(routerService, "goToUrl");

        it("should call goToUrl", () => {
            routerServiceMock.mockReturnValue(undefined);
            controller.goToStep1();

            expect(routerServiceMock).toHaveBeenCalledWith("/depot-scdl/formulaire/etape-1");
        });
    });
});
