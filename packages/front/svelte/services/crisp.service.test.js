/* global $crisp:readonly */

import crispService from "@services/crisp.service";

describe("crisp service", () => {
    const crispPushSpy = jest.spyOn($crisp, "push").mockImplementation(jest.fn());
    const EMAIL = "a@b.c";

    describe("saveUserEmail", () => {
        it("calls crisp push with proper args", () => {
            crispService.setUserEmail(EMAIL);
            expect(crispPushSpy).toBeCalledWith(["set", "user:email", [EMAIL]]);
        });
    });
});
