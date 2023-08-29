import { nanoid } from "nanoid";
import ActivateAccountController from "./ActivateAccount.controller";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service.js";

vi.mock("$lib/resources/auth/auth.service", () => ({
    default: {
        resetPassword: vi.fn(async () => ({})),
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
        it("should call authService.resetPassword()", async () => {
            const PASSWORD = "qdjqd12334nHH!";
            controller = new ActivateAccountController(FAKE_TOKEN);
            await controller.onSubmit({ password: PASSWORD });
            expect(authService.resetPassword).toHaveBeenCalledWith(FAKE_TOKEN, PASSWORD);
        });

        it("should call window.location.assign", async () => {
            const PASSWORD = "qdjqd12334nHH!";
            controller = new ActivateAccountController(FAKE_TOKEN);
            await controller.onSubmit({ password: PASSWORD });
            expect(goToUrl).toHaveBeenCalledWith("/auth/login?success=ACCOUNT_ACTIVATED");
        });
    });
});
