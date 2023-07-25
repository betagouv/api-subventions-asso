import DefinePasswordController from "./DefinePassword.controller";

describe("DefinePasswordController", () => {
    const VALUES = {
        password: "",
        confirm: "",
    };
    describe("checkConfirm", () => {
        it("should set showConfirmError to false with confirm empty", () => {
            const expected = false;
            const values = { ...VALUES, password: "abc123DE!" };
            const controller = new DefinePasswordController(values);
            controller.checkConfirm();
            const actual = controller.showConfirmError.value;
            expect(actual).toEqual(expected);
        });

        it("should set showConfirmError to false when password equals confirm", () => {
            const expected = false;
            const values = { password: "abc123DE!", confirm: "abc123DE!" };
            const controller = new DefinePasswordController(values);
            controller.checkConfirm();
            const actual = controller.showConfirmError.value;
            expect(actual).toEqual(expected);
        });

        it("should set showConfirmError to true when password does not equals confirm", () => {
            const expected = true;
            const values = { password: "abc123DE!", confirm: "abc123DE@" };
            const controller = new DefinePasswordController(values);
            controller.checkConfirm();
            const actual = controller.showConfirmError.value;
            expect(actual).toEqual(expected);
        });
    });
});
