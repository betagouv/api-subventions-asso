import { nanoid } from "nanoid/non-secure";
import { AgentTypeEnum } from "dto";
import ActivateAccountController from "./ActivateAccount.controller";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service.js";
import trackerService from "$lib/services/tracker.service";

vi.mock("$lib/resources/auth/auth.service", () => ({
    default: {
        activate: vi.fn(async () => ({})),
    },
}));
vi.mock("$lib/services/router.service");
vi.mock("$lib/services/tracker.service");

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
            confirmPwd: "duplicate password",
        };

        it("should call authService.activate() with given values but with confirmPwd removed", async () => {
            const { confirmPwd: _confirmPwd, ...userWithoutConfirmPwd } = USER;
            controller = new ActivateAccountController(FAKE_TOKEN);
            await controller.onSubmit(USER);
            expect(authService.activate).toHaveBeenCalledWith(FAKE_TOKEN, userWithoutConfirmPwd);
        });

        it("should redirect to successful login", async () => {
            controller = new ActivateAccountController(FAKE_TOKEN);
            await controller.onSubmit(USER);
            expect(goToUrl).toHaveBeenCalledWith("/?success=ACCOUNT_ACTIVATED");
        });

        it("tracks successful submits", async () => {
            controller = new ActivateAccountController(FAKE_TOKEN);
            vi.mocked(authService.activate).mockResolvedValueOnce(true);
            await controller.onSubmit(USER);
            const actual = vi.mocked(trackerService.buttonClickEvent).mock.calls[0];
            expect(actual).toMatchInlineSnapshot(`
              [
                "activate.form.step.submit-success",
              ]
            `);
        });

        it("tracks failed submits", async () => {
            controller = new ActivateAccountController(FAKE_TOKEN);
            vi.mocked(authService.activate).mockRejectedValueOnce({ message: "explanation" });
            await controller.onSubmit(USER);
            const actual = vi.mocked(trackerService.buttonClickEvent).mock.calls[0];
            expect(actual).toMatchInlineSnapshot(`
              [
                "activate.form.submit-error",
                "explanation",
              ]
            `);
        });
    });
});
