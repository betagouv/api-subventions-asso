import ActivateAccountController from "./ActivateAccount.controller";

describe("ActivateAccountController", () => {
    let controller;

    afterEach(() => (controller = null));

    describe("constructor", () => {
        const STEPS = [{ component: new Object(), name: "Step 1" }];
        beforeEach(() => (controller = new ActivateAccountController()));
        it("should define form steps", () => {
            const expected = STEPS;
            const actual = controller.steps;
            expect(actual).toEqual(expected);
        });
    });
});
