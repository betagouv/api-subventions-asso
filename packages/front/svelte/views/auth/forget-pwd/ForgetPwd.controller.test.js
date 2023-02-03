import ForgetPwdController from "./ForgetPwd.controller";
import authService from "@resources/auth/auth.service";

describe("SignupController", () => {
    describe("constructor and static values", () => {
        it.each`
            propertyName        | expected
            ${"email"}          | ${""}
            ${"promise"}        | ${Promise.resolve()}
            ${"firstSubmitted"} | ${false}
        `("initializes correctly $propertyName store", ({ propertyName, expected }) => {
            const ctrl = new ForgetPwdController();
            expect(ctrl[propertyName].value).toEqual(expected);
        });
    });

    describe("onSubmit", () => {
        const ctrl = new ForgetPwdController();
        const serviceMock = jest.spyOn(authService, "forgetPassword");
        const PROMISE = Promise.resolve();
        const EMAIL = "alice@test.fr";
        let setPromiseMock;
        let setFirstSubmittedMock;

        beforeAll(() => {
            serviceMock.mockReturnValue(PROMISE);
            setPromiseMock = jest.spyOn(ctrl.promise, "set");
            setFirstSubmittedMock = jest.spyOn(ctrl.firstSubmitted, "set");
            ctrl.email.value = EMAIL;
        });
        afterAll(() => serviceMock.mockRestore());

        it("calls service with value from controller", () => {
            ctrl.onSubmit();
            expect(serviceMock).toBeCalledWith(EMAIL);
        });

        it("sets promise with value from service", () => {
            ctrl.onSubmit();
            expect(setPromiseMock).toBeCalledWith(PROMISE);
        });

        it("registers first submitted state", () => {
            ctrl.onSubmit();
            expect(setFirstSubmittedMock).toBeCalledWith(true);
        });
    });
});
