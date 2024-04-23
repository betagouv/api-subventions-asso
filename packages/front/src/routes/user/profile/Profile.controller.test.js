import { ProfileController } from "./Profile.controller";
import userService from "$lib/resources/users/user.service";
vi.mock("$lib/resources/users/user.service");

describe("ProfileController", () => {
    let controller;

    beforeEach(() => (controller = new ProfileController()));

    describe("init", () => {
        it("sets user store according to userService", async () => {
            const USER = { tada: "anything" };
            vi.mocked(userService.getSelfUser).mockResolvedValue(USER);
            await controller.init();
            const expected = USER;
            const actual = controller.user.value;
            expect(actual).toBe(expected);
        });

        it.each`
            expected | user
            ${true}  | ${{ agentConnectId: "something" }}
            ${false} | ${{ agentConnectId: null }}
        `("sets isAgentConnectUser property to $expected according to user", async ({ expected, user }) => {
            vi.mocked(userService.getSelfUser).mockResolvedValue(user);
            await controller.init();
            const actual = controller.isAgentConnectUser;
            expect(actual).toBe(expected);
        });
    });

    describe("deleteUser()", () => {
        it("should call userService.deleteCurrentUser()", async () => {
            await controller.deleteUser();
            expect(userService.deleteCurrentUser).toHaveBeenCalledTimes(1);
        });
    });
});
