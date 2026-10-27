/* global $crisp:readonly */
vi.stubGlobal("$crisp", {
    push: vi.fn(),
});

import crispService from "$lib/services/crisp.service";

describe("crisp service", () => {
    describe("saveUserEmail", () => {
        const EMAIL = "a@b.c";
        it("calls crisp push with proper args", () => {
            crispService.setUserEmail(EMAIL);
            // @ts-expect-error: mocked global
            expect($crisp.push).toHaveBeenCalledWith(["set", "user:email", [EMAIL]]);
        });
    });

    describe("resetSession", () => {
        it("calls crisp push with proper args", () => {
            crispService.resetSession();
            // @ts-expect-error: mocked global
            expect($crisp.push).toHaveBeenCalledWith(["do", "session:reset"]);
        });
    });
});
