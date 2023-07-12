import { ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import { ResetPwdController } from "./ResetPwd.controller";
import authService from "@resources/auth/auth.service";

jest.mock("@api-subventions-asso/dto", () => ({
    ...jest.requireActual("@api-subventions-asso/dto"),
    ResetPasswordErrorCodes: {
        RESET_TOKEN_NOT_FOUND: 1,
        RESET_TOKEN_EXPIRED: 2,
        USER_NOT_FOUND: 3,
        PASSWORD_FORMAT_INVALID: 4,
        INTERNAL_ERROR: 5,
    },
    __esModule: true, // this property makes it work
}));

describe("ResetPwdController", () => {
    const TOKEN = "123TOKEN";
    const PASSWORD = "very secret";

    describe("constructor and static values", () => {
        it.each`
            propertyName  | expected
            ${"password"} | ${""}
            ${"promise"}  | ${Promise.resolve()}
        `("initializes correctly $propertyName store", ({ propertyName, expected }) => {
            const ctrl = new ResetPwdController(TOKEN);
            expect(ctrl[propertyName].value).toEqual(expected);
        });

        it("does not fail if no token given", () => {
            const test = () => {
                const ctrl = new ResetPwdController();
                return ctrl.promise.value;
            };
            const expected = ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND;
            expect(test).rejects.toEqual(expected);
        });

        it.each`
            queryParam   | expected
            ${undefined} | ${false}
            ${"TRUE"}    | ${true}
        `(
            "gets active query param",
            // TODO
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            ({ queryParam, expected }) => {},
        );

        // TODO
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        it("sets title for activation according activation", () => {});

        // TODO
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        it("sets title for reset according activation", () => {});
    });

    describe("onSubmit", () => {
        const ctrl = new ResetPwdController(TOKEN);
        const serviceMock = jest.spyOn(authService, "resetPassword");
        const PROMISE = Promise.resolve();
        let setPromiseMock;

        beforeAll(() => {
            serviceMock.mockReturnValue(PROMISE);
            setPromiseMock = jest.spyOn(ctrl.promise, "set");
            ctrl.password.value = PASSWORD;

            delete window.location;
            window.location = { assign: jest.fn() };
        });
        afterAll(() => serviceMock.mockRestore());

        it("calls service with value from controller", () => {
            ctrl.onSubmit();
            expect(serviceMock).toBeCalledWith(TOKEN, PASSWORD);
        });

        it("sets promise with value from service", () => {
            ctrl.onSubmit();
            expect(setPromiseMock).toBeCalledWith(PROMISE);
        });

        it.each`
            active   | queryParam             | case
            ${true}  | ${"ACCOUNT_ACTIVATED"} | ${"activation"}
            ${false} | ${"PASSWORD_CHANGED"}  | ${"reset"}
        `("redirects if success with proper query in $case case", async ({ active, queryParam }) => {
            ctrl.activation = active;
            const expected = `/auth/login?success=${queryParam}`;
            await ctrl.onSubmit();
            expect(window.location.assign).toBeCalledWith(expected);
        });

        it("catches promise rejection", async () => {
            const test = async () => await ctrl.onSubmit();
            await expect(test).resolves;
        });
    });

    describe("getErrorMessage", () => {
        const ctrl = new ResetPwdController(TOKEN);
        const FOUND_MESSAGE = "Le code erreur est trouvé";
        ctrl.ERROR_MESSAGES = { 42: FOUND_MESSAGE };

        it("returns value from dict if found", () => {
            const expected = FOUND_MESSAGE;
            const actual = ctrl.getErrorMessage({ data: { code : 42 } });
            expect(actual).toBe(expected);
        });

        it("returns default value if code not in dict", () => {
            const expected = "Une erreur est survenue lors de la création de votre compte.";
            const actual = ctrl.getErrorMessage({ data: { code : 43 } });
            expect(actual).toBe(expected);
        });
    });

    describe("checkPassword", () => {
        const ctrl = new ResetPwdController(TOKEN);

        it.each`
            condition                  | attemptedPwd
            ${"digit"}                 | ${"testPassword."}
            ${"lowercase letter"}      | ${"TESTPASS0RD."}
            ${"uppercase letter"}      | ${"testpassw0rd."}
            ${"special character"}     | ${"testPassw0rd"}
            ${"at least 8 characters"} | ${"te5tPa."}
            ${"at most 32 characters"} | ${"testPassw0rd.1234567890$poiuytre4"}
        `("rejects that don't contain $condition", ({ attemptedPwd }) => {
            const expected = false;
            const actual = ctrl.checkPassword(attemptedPwd);
            expect(actual).toBe(expected);
        });

        it("accepts proper password", () => {
            const expected = true;
            const actual = ctrl.checkPassword("testPass0rd.");
            expect(actual).toBe(expected);
        });
    });
});
