import DefinePasswordController from "./DefinePassword.controller";
import * as ValidatorService from "$lib/services/validator.service";
vi.mock("$lib/services/validator.service");
vi.mock("$lib/core/Dispatch", () => ({
    default: {
        getDispatcher: () => vi.fn(),
    },
}));

describe("DefinePasswordController", () => {
    const VALUES = {
        password: "",
        confirmPwd: "",
    };

    describe("_validatePassword", () => {
        beforeEach(() => vi.mocked(ValidatorService).checkPassword.mockImplementation(() => true));

        it("should call ValidatorService._validatePassword()", () => {
            const values = { ...VALUES, password: "abc123DE!" };
            const controller = new DefinePasswordController(values);
            controller._validatePassword();
            expect(ValidatorService.checkPassword).toHaveBeenCalledWith(values.password);
        });

        it("should call _onPasswordValid()", () => {
            const values = { ...VALUES, password: "abc123DE!" };
            const controller = new DefinePasswordController(values);
            const mockOnPasswordValid = vi.spyOn(controller, "_onPasswordValid").mockImplementation(vi.fn());
            controller._validatePassword();
            expect(mockOnPasswordValid).toHaveBeenCalledTimes(1);
        });

        it("should call _onPasswordError()", () => {
            vi.mocked(ValidatorService).checkPassword.mockImplementation(() => false);
            const values = { ...VALUES, password: "abc12" };
            const controller = new DefinePasswordController(values);
            const mockOnPasswordError = vi.spyOn(controller, "_onPasswordError").mockImplementation(vi.fn());
            controller._validatePassword();
            expect(mockOnPasswordError).toHaveBeenCalledTimes(1);
        });
    });

    describe("_onPasswordError()", () => {
        let spyDispatchError;

        beforeAll(() => {
            spyDispatchError = vi
                .spyOn(DefinePasswordController.prototype, "_dispatchError")
                .mockImplementation(vi.fn());
        });

        it("should call _dispatchError()", () => {
            const controller = new DefinePasswordController(VALUES);
            controller._onPasswordError();
            expect(spyDispatchError).toHaveBeenCalledTimes(1);
        });

        it("should set showPasswordError to true", () => {
            const expected = true;
            const controller = new DefinePasswordController(VALUES);
            controller._onPasswordError();
            const actual = controller.showPasswordError.value;
            expect(actual).toEqual(expected);
        });
    });

    describe("_onConfirmValid()", () => {
        let spyOneFieldValid;

        beforeAll(() => {
            spyOneFieldValid = vi
                .spyOn(DefinePasswordController.prototype, "_onOneFieldValid")
                .mockImplementation(vi.fn);
        });

        it("should call _onOneFieldValid()", () => {
            const controller = new DefinePasswordController(VALUES);
            controller._onConfirmValid();
            expect(spyOneFieldValid).toHaveBeenCalledTimes(1);
        });

        it("should set showConfirmError to false", () => {
            const expected = false;
            const controller = new DefinePasswordController(VALUES);
            controller._onConfirmValid();
            const actual = controller.showConfirmError.value;
            expect(actual).toEqual(expected);
        });
    });

    describe("_onConfirmError()", () => {
        let spyDispatchError;

        beforeAll(() => {
            spyDispatchError = vi
                .spyOn(DefinePasswordController.prototype, "_dispatchError")
                .mockImplementation(vi.fn());
        });

        it("should call _dispatchError()", () => {
            const controller = new DefinePasswordController(VALUES);
            controller._onConfirmError();
            expect(spyDispatchError).toHaveBeenCalledTimes(1);
        });

        it("should set showConfirmError to true", () => {
            const expected = true;
            const controller = new DefinePasswordController(VALUES);
            controller._onConfirmError();
            const actual = controller.showConfirmError.value;
            expect(actual).toEqual(expected);
        });
    });
});
