import ForgetPwdController from "./ForgetPwd.controller";
import authService from "$lib/resources/auth/auth.service";

describe("ForgetPwdController", () => {
    describe("constructor and static values", () => {
        it.each`
            propertyName        | expected
            ${"email"}          | ${""}
            ${"firstSubmitted"} | ${false}
        `("initializes correctly $propertyName store", ({ propertyName, expected }) => {
            const ctrl = new ForgetPwdController();
            expect(ctrl[propertyName].value).toEqual(expected);
        });
    });
    it("initializes correctly 'promise' store", async () => {
        const ctrl = new ForgetPwdController();
        await expect(ctrl.promise.value).resolves.toBeUndefined();
    });

    describe("onSubmit", () => {
        const ctrl = new ForgetPwdController();
        const serviceMock = vi.spyOn(authService, "forgetPassword");
        const PROMISE = Promise.resolve();
        const EMAIL = "alice@test.fr";
        let setPromiseMock;
        let setFirstSubmittedMock;

        beforeAll(() => {
            serviceMock.mockReturnValue(PROMISE);
            setPromiseMock = vi.spyOn(ctrl.promise, "set");
            setFirstSubmittedMock = vi.spyOn(ctrl.firstSubmitted, "set");
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
