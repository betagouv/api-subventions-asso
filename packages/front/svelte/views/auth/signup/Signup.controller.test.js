import SignupController from "./Signup.controller";
import authService from "@resources/auth/auth.service";
import { getContext } from "svelte";

// TODO update path after switch svelte to ts #330
jest.mock("@api-subventions-asso/dto/build/auth/SignupDtoResponse", () => ({
    SignupErrorCodes: {
        EMAIL_NOT_VALID: 1,
        USER_ALREADY_EXIST: 2,
        CREATION_ERROR: 3,
        CREATION_RESET_ERROR: 4,
        EMAIL_MUST_BE_END_GOUV: 5
    },
    __esModule: true // this property makes it work
}));

const NAME = "nom";

jest.mock("svelte", () => ({
    __esModule: true, // this property makes it work
    getContext: jest.fn(() => ({
        getName: jest.fn(() => NAME)
    }))
}));

describe("SignupController", () => {
    describe("constructor and static values", () => {
        const APP = { getName: jest.fn() };
        afterAll(() => getContext.mockRestore());

        it("gets context", () => {
            new SignupController();
            expect(getContext).toBeCalled();
        });

        it("sets app with return value from context", () => {
            getContext.mockReturnValueOnce(APP);
            const ctrl = new SignupController();
            const expected = APP;
            const actual = ctrl.app;
            expect(actual).toBe(expected);
        });

        it("gets app name from context", () => {
            const ctrl = new SignupController();
            expect(ctrl.app.getName).toBeCalled();
        });
        it("sets pageTitle from app getName return value", () => {
            const ctrl = new SignupController();
            const actual = ctrl.pageTitle;
            const expected = "Créer votre compte sur nom";
            expect(actual).toBe(expected);
        });

        it.each`
            propertyName        | expected
            ${"email"}          | ${""}
            ${"signupPromise"}  | ${Promise.resolve()}
            ${"firstSubmitted"} | ${false}
        `("initializes correctly $propertyName store", ({ propertyName, expected }) => {
            const ctrl = new SignupController();
            expect(ctrl[propertyName].value).toEqual(expected);
        });
    });

    describe("onSubmit", () => {
        const ctrl = new SignupController();
        const serviceMock = jest.spyOn(authService, "signup");
        const PROMISE = Promise.resolve();
        const EMAIL = "alice@test.fr";
        let setPromiseMock;
        let setFirstSubmittedMock;

        beforeAll(() => {
            serviceMock.mockReturnValue(PROMISE);
            setPromiseMock = jest.spyOn(ctrl.signupPromise, "set");
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

    describe("getErrorMessage", () => {
        const ctrl = new SignupController();
        const ERROR_CODE = 42;
        const ERROR = { message: ERROR_CODE.toString() };
        const privateSpy = jest.spyOn(ctrl, "_getErrorMessageByCode");
        const MESSAGE = "Voici la raison de l'erreur";

        it("should call private method with error code", () => {
            privateSpy.mockReturnValueOnce(MESSAGE);
            ctrl.getErrorMessage(ERROR);
            expect(privateSpy).toHaveBeenCalledWith(ERROR_CODE);
        });
    });

    describe("_getErrorMessageByCode", () => {
        const ctrl = new SignupController();
        const FOUND_MESSAGE = "Le code erreur est trouvé";
        ctrl.ERROR_MESSAGES = { 42: FOUND_MESSAGE };

        it("returns value from dict if found", () => {
            const expected = FOUND_MESSAGE;
            const actual = ctrl._getErrorMessageByCode(42);
            expect(actual).toBe(expected);
        });

        it("returns default value if code not in dict", () => {
            const expected = "Une erreur est survenue lors de la création de votre compte.";
            const actual = ctrl._getErrorMessageByCode(43);
            expect(actual).toBe(expected);
        });
    });

    describe("getter contact Email", () => {
        const ctrl = new SignupController();
        const MAIL = "contact@mail.fr";
        const nameMock = jest.fn(() => MAIL);
        ctrl.app = { getContact: nameMock };

        it("gets email from app", () => {
            ctrl.contactEmail;
            expect(nameMock).toBeCalled();
        });

        it("return value from app", () => {
            const expected = MAIL;
            const actual = ctrl.contactEmail;
            expect(actual).toBe(expected);
        });
    });
});
