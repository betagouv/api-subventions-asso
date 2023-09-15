import { ResetPwdModuleController } from "./ResetPwdModule.controller";
import authService from "$lib/resources/auth/auth.service";

vi.mock("$lib/resources/auth/auth.service", () => ({
    default: {
        forgetPassword: vi.fn(() => Promise.resolve(true)),
    },
}));
vi.mock("svelte", () => ({
    getContext: () => ({ getContact: () => "contact" }),
}));

describe("ResetPwdModuleController", () => {
    let ctrl: ResetPwdModuleController;
    const EMAIL = "test@mail.fr";

    beforeEach(() => {
        ctrl = new ResetPwdModuleController(EMAIL);
    });
    describe("onClick", () => {
        beforeEach(() => {
            // @ts-expect-error mock
            ctrl._email = EMAIL;
        });
        it("calls forgetPassword", async () => {
            await ctrl.onClick();
            expect(authService.forgetPassword).toHaveBeenCalledWith(EMAIL);
        });

        it("sets success status if forgetPassword resolves", async () => {
            const expected = "success";
            await ctrl.onClick();
            const actual = ctrl.status.value;
            expect(actual).toBe(expected);
        });

        it("sets error status if forgetPassword rejects", async () => {
            vi.mocked(authService.forgetPassword).mockRejectedValueOnce(false);
            const expected = "error";
            await ctrl.onClick();
            const actual = ctrl.status.value;
            expect(actual).toBe(expected);
        });
    });
});
