import { nanoid } from "nanoid";
import ActivateAccountController from "./ActivateAccount.controller";
import authService from "@resources/auth/auth.service";

jest.mock("@resources/auth/auth.service", () => ({
    resetPassword: jest.fn(async () => ({})),
}));

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
        const mockAssign = jest.fn();

        beforeEach(() => {
            delete window.location;
            window.location = { assign: mockAssign };
        });

        afterEach(() => mockAssign.mockReset());

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
            expect(mockAssign).toHaveBeenCalledWith("/auth/login?success=ACCOUNT_ACTIVATED");
        });
    });
});
