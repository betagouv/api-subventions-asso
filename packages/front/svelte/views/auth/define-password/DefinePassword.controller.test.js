import DefinePasswordController from "./DefinePassword.controller";
import * as ValidatorService from "@services/validator.service";
jest.mock("@services/validator.service");
import Dispatch from "@core/Dispatch";
jest.mock("@core/Dispatch", () => ({
    getDispatcher: () => jest.fn(),
}));

describe("DefinePasswordController", () => {
    const VALUES = {
        password: "",
        confirmPwd: "",
    };

    describe("_validatePassword", () => {
        beforeEach(() => ValidatorService.checkPassword.mockImplementation(() => true));

        it("should call ValidatorService._validatePassword()", () => {
            const values = { ...VALUES, password: "abc123DE!" };
            const controller = new DefinePasswordController(values);
            controller._validatePassword();
            expect(ValidatorService.checkPassword).toHaveBeenCalledWith(values.password);
        });

        it("should call _onPasswordValid()", () => {
            const values = { ...VALUES, password: "abc123DE!" };
            const controller = new DefinePasswordController(values);
            const mockOnPasswordValid = jest.spyOn(controller, "_onPasswordValid").mockImplementation(jest.fn());
            controller._validatePassword();
            expect(mockOnPasswordValid).toHaveBeenCalledTimes(1);
        });

        it("should call _onPasswordError()", () => {
            ValidatorService.checkPassword.mockImplementation(() => false);
            const values = { ...VALUES, password: "abc12" };
            const controller = new DefinePasswordController(values);
            const mockOnPasswordError = jest.spyOn(controller, "_onPasswordError").mockImplementation(jest.fn());
            controller._validatePassword();
            expect(mockOnPasswordError).toHaveBeenCalledTimes(1);
        });
    });

    describe("_onPasswordError()", () => {
        let spyHandleErrorDispatch;

        beforeAll(() => {
            spyHandleErrorDispatch = jest
                .spyOn(DefinePasswordController.prototype, "_handleErrorDispatch")
                .mockImplementation(jest.fn());
        });

        it("should call _handleErrorDispatch()", () => {
            const controller = new DefinePasswordController(VALUES);
            controller._onPasswordError();
            expect(spyHandleErrorDispatch).toHaveBeenCalledTimes(1);
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
        let spyHandleValidDispatch;

        beforeAll(() => {
            spyHandleValidDispatch = jest
                .spyOn(DefinePasswordController.prototype, "_handleValidDispatch")
                .mockImplementation(jest.fn());
        });

        it("should call _handleValidDispatch()", () => {
            const controller = new DefinePasswordController(VALUES);
            controller._onConfirmValid();
            expect(spyHandleValidDispatch).toHaveBeenCalledTimes(1);
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
        let spyHandleErrorDispatch;

        beforeAll(() => {
            spyHandleErrorDispatch = jest
                .spyOn(DefinePasswordController.prototype, "_handleErrorDispatch")
                .mockImplementation(jest.fn());
        });

        it("should call _handleErrorDispatch()", () => {
            const controller = new DefinePasswordController(VALUES);
            controller._onConfirmError();
            expect(spyHandleErrorDispatch).toHaveBeenCalledTimes(1);
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
