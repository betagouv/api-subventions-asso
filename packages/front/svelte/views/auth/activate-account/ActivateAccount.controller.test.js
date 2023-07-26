import ActivateAccountController from "./ActivateAccount.controller";

describe("ActivateAccountController", () => {
    let controller;

    afterEach(() => (controller = null));

    describe("constructor", () => {
        beforeEach(() => (controller = new ActivateAccountController()));
        it("should define form steps", () => {
            const actual = controller.steps;
            expect(actual).toMatchSnapshot();
        });
    });
});
