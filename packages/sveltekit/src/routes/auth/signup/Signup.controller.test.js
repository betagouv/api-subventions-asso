import { getContext } from "svelte";
import SignupController from "./Signup.controller";
import authService from "$lib/resources/auth/auth.service";

vi.mock("@api-subventions-asso/dto", () => ({
    ...vi.importActual("@api-subventions-asso/dto"),
    SignupErrorCodes: {
        EMAIL_NOT_VALID: 1,
        USER_ALREADY_EXIST: 2,
        CREATION_ERROR: 3,
        CREATION_RESET_ERROR: 4,
        EMAIL_MUST_BE_END_GOUV: 5,
    },
    __esModule: true, // this property makes it work
}));

const NAME = "nom";

vi.mock("svelte", () => ({
    __esModule: true, // this property makes it work
    getContext: vi.fn(() => ({
        getName: vi.fn(() => NAME),
    })),
}));

describe("SignupController", () => {
    describe("constructor and static values", () => {
        const APP = { getName: vi.fn() };
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
            ${"signupUser"}     | ${{ lastname: null, firstname: null, email: null }}
            ${"firstSubmitted"} | ${false}
        `("initializes correctly $propertyName store", ({ propertyName, expected }) => {
            const ctrl = new SignupController();
            expect(ctrl[propertyName].value).toEqual(expected);
        });

        it("initializes correctly signupPromise store", async () => {
            const ctrl = new SignupController();
            await expect(ctrl.signupPromise.value).resolves.toBeUndefined();
        });
    });

    describe("signup()", () => {
        const ctrl = new SignupController();
        const serviceMock = vi.spyOn(authService, "signup");
        const PROMISE = Promise.resolve();
        const USER = { email: "test@mail.fr", lastName: "", firstName: "" };
        let setPromiseMock;
        let setFirstSubmittedMock;

        beforeAll(() => {
            serviceMock.mockReturnValue(PROMISE);
            setPromiseMock = vi.spyOn(ctrl.signupPromise, "set");
            setFirstSubmittedMock = vi.spyOn(ctrl.firstSubmitted, "set");
            ctrl.signupUser.value = USER;
        });
        afterAll(() => serviceMock.mockRestore());

        it("calls service with value from controller", () => {
            ctrl.signup();
            expect(serviceMock).toBeCalledWith(USER);
        });

        it("sets promise with value from service", () => {
            ctrl.signup();
            expect(setPromiseMock).toBeCalledWith(PROMISE);
        });

        it("registers first submitted state", () => {
            ctrl.signup();
            expect(setFirstSubmittedMock).toBeCalledWith(true);
        });
    });

    describe("getErrorMessage", () => {
        const ctrl = new SignupController();
        const FOUND_MESSAGE = "Le code erreur est trouvé";
        ctrl.ERROR_MESSAGES = { 42: FOUND_MESSAGE };

        it("returns value from dict if found", () => {
            const expected = FOUND_MESSAGE;
            const actual = ctrl.getErrorMessage({ data: { code: 42 } });
            expect(actual).toBe(expected);
        });

        it("returns default value if code not in dict", () => {
            const expected = "Une erreur est survenue lors de la création de votre compte.";
            const actual = ctrl.getErrorMessage({ data: { code: 43 } });
            expect(actual).toBe(expected);
        });
    });

    describe("getter contact Email", () => {
        const ctrl = new SignupController();
        const MAIL = "contact@mail.fr";
        const nameMock = vi.fn(() => MAIL);
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
