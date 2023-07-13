import { ProfileController } from "./Profile.controller";
import userService from "@resources/users/user.service";
jest.mock("@resources/users/user.service");

describe("ProfileController", () => {
    let controller;

    beforeEach(() => (controller = new ProfileController()));

    describe("deleteUser()", () => {
        it("should call userService.deleteCurrentUser()", async () => {
            await controller.deleteUser();
            expect(userService.deleteCurrentUser).toHaveBeenCalledTimes(1);
        });
    });
});
