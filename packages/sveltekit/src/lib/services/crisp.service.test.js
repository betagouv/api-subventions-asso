vi.stubGlobal('$crisp', {
  push: vi.fn(),
})

import crispService from "$lib/services/crisp.service";

describe("crisp service", () => {
    describe("saveUserEmail", () => {
        const EMAIL = "a@b.c";
        it("calls crisp push with proper args", () => {
            crispService.setUserEmail(EMAIL);
            expect($crisp.push).toBeCalledWith(["set", "user:email", [EMAIL]]);
        });
    });

    describe("resetSession", () => {
        it("calls crisp push with proper args", () => {
            crispService.resetSession();
            expect($crisp.push).toBeCalledWith(["do", "session:reset"]);
        });
    });
});
