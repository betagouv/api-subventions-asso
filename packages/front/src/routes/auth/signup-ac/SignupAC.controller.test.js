import { AgentTypeEnum } from "dto";
import SignupACController from "./SignupAC.controller";
import userService from "$lib/resources/users/user.service";
vi.mock("$lib/resources/users/user.service");
import { goToUrl } from "$lib/services/router.service.js";
vi.mock("$lib/services/router.service");

describe("SignupACController", () => {
    let controller;

    beforeEach(() => (controller = new SignupACController()));
    afterEach(() => (controller = null));

    describe("constructor", () => {
        it("should define form steps", () => {
            const actual = controller.steps;
            expect(actual).toMatchSnapshot();
        });
    });

    describe("onSubmit", () => {
        const USER = {
            agentType: AgentTypeEnum.OPERATOR,
            something: "something",
        };
        const userServiceMock = vi.spyOn(userService, "updateProfile");

        it("should call userService.updateProfile()", async () => {
            await controller.onSubmit(USER);
            expect(userServiceMock).toHaveBeenCalledWith(USER);
        });

        it("should redirect to successful login", async () => {
            await controller.onSubmit(USER);
            expect(goToUrl).toHaveBeenCalledWith("/?success=ACCOUNT_ACTIVATED", true, true);
        });
    });
});
