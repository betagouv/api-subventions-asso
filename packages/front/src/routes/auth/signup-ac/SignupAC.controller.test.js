import { AgentTypeEnum } from "dto";
import SignupACController from "./SignupAC.controller";
import userService from "$lib/resources/users/user.service";
vi.mock("$lib/resources/users/user.service");

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
        const userServiceMock = vi.spyOn(userService, "completeProfile");

        it("should call userService.completeProfile()", async () => {
            await controller.onSubmit(USER);
            expect(userServiceMock).toHaveBeenCalledWith(USER);
        });
    });
});
