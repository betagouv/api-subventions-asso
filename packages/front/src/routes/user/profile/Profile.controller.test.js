import { ProfileController } from "./Profile.controller";
import userService from "$lib/resources/users/user.service";
import { goToUrl } from "$lib/services/router.service";
vi.mock("$lib/services/router.service");
vi.mock("$lib/resources/users/user.service");

describe("ProfileController", () => {
    let controller;

    beforeEach(() => (controller = new ProfileController()));

    describe("deleteUser()", () => {
        it("should call userService.deleteCurrentUser()", async () => {
            await controller.deleteUser();
            expect(userService.deleteCurrentUser).toHaveBeenCalledTimes(1);
        });

        it("should call goToUrl()", async () => {
            await controller.deleteUser();
            expect(goToUrl).toHaveBeenCalledTimes(1);
        });
    });
});
