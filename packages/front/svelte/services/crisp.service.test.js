/* global $crisp:readonly */

import crispService from "@services/crisp.service";

describe("crisp service", () => {
    const crispPushSpy = jest.spyOn($crisp, "push").mockImplementation(jest.fn());

    describe("saveUserEmail", () => {
        const EMAIL = "a@b.c";
        it("calls crisp push with proper args", () => {
            crispService.setUserEmail(EMAIL);
            expect(crispPushSpy).toBeCalledWith(["set", "user:email", [EMAIL]]);
        });
    });

    describe("resetSession", () => {
        it("calls crisp push with proper args", () => {
            crispService.resetSession();
            expect(crispPushSpy).toBeCalledWith(["do", "session:reset"]);
        });
    });
});
