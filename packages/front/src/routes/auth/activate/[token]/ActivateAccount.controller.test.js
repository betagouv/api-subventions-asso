import { nanoid } from "nanoid";
import { AgentTypeEnum } from "dto";
import ActivateAccountController from "./ActivateAccount.controller";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service.js";

vi.mock("$lib/resources/auth/auth.service", () => ({
    default: {
        activate: vi.fn(async () => ({})),
    },
}));
vi.mock("$lib/services/router.service");

describe("ActivateAccountController", () => {
    let controller;

    const FAKE_TOKEN = nanoid();

    afterEach(() => (controller = null));

    describe("constructor", () => {
        beforeEach(() => (controller = new ActivateAccountController(FAKE_TOKEN)));
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

        it("should call authService.activate() with given values", async () => {
            controller = new ActivateAccountController(FAKE_TOKEN);
            await controller.onSubmit(USER);
            expect(authService.activate).toHaveBeenCalledWith(FAKE_TOKEN, USER);
        });

        it("should redirect to successful login", async () => {
            controller = new ActivateAccountController(FAKE_TOKEN);
            await controller.onSubmit(USER);
            expect(goToUrl).toHaveBeenCalledWith("/auth/login?success=ACCOUNT_ACTIVATED", false, true);
        });
    });
});
