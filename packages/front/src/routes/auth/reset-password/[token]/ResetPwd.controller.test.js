import { ResetPasswordErrorCodes } from "dto";
import { ResetPwdController } from "./ResetPwd.controller";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service.js";

vi.mock("dto", async () => {
    const actual = await vi.importActual("dto");
    return {
        ...actual,
        ResetPasswordErrorCodes: {
            RESET_TOKEN_NOT_FOUND: 1,
            RESET_TOKEN_EXPIRED: 2,
            USER_NOT_FOUND: 3,
            PASSWORD_FORMAT_INVALID: 4,
            INTERNAL_ERROR: 5,
        },
        __esModule: true, // this property makes it work
    };
});
vi.mock("$lib/services/router.service");

describe("ResetPwdController", () => {
    const TOKEN = "123TOKEN";
    const PASSWORD = "very secret";

    describe("constructor and static values", () => {
        it("initializes correctly 'values' store", () => {
            const expected = { password: "", confirm: "" };
            const ctrl = new ResetPwdController(TOKEN);
            expect(ctrl.values.value).toEqual(expected);
        });

        it("initializes correctly 'promise' store", async () => {
            const ctrl = new ResetPwdController(TOKEN);
            await expect(ctrl.promise.value).resolves.toBeUndefined();
        });

        it("does not fail if no token given", async () => {
            const test = () => {
                const ctrl = new ResetPwdController();
                return ctrl.promise.value;
            };
            const expected = ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND;
            await expect(test).rejects.toEqual(expected);
        });

        // eslint-disable-next-line vitest/no-commented-out-tests
        /*        TODO
        it.each`
            queryParam   | expected
            ${undefined} | ${false}
            ${"TRUE"}    | ${true}
        `(
            "gets active query param",
            ({ queryParam, expected }) => {},
        );

        it("sets title for activation according activation", () => {});

        it("sets title for reset according activation", () => {});*/
    });

    describe("onSubmit", () => {
        const ctrl = new ResetPwdController(TOKEN);
        const serviceMock = vi.spyOn(authService, "resetPassword");
        const PROMISE = Promise.resolve();
        let setPromiseMock;

        beforeAll(() => {
            serviceMock.mockReturnValue(PROMISE);
            setPromiseMock = vi.spyOn(ctrl.promise, "set");
            ctrl.values.value.password = PASSWORD;
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
            active   | queryParam     | case
            ${false} | ${"PWD_RESET"} | ${"reset"}
        `("redirects if success with proper query in $case case", async ({ active, queryParam }) => {
            ctrl.activation = active;
            const expected = `/?success=${queryParam}`;
            await ctrl.onSubmit();
            expect(goToUrl).toBeCalledWith(expected, true, true);
        });

        it("catches promise rejection", async () => {
            const test = ctrl.onSubmit();
            await expect(test).resolves.not.toThrow();
        });
    });

    describe("getErrorMessage", () => {
        const ctrl = new ResetPwdController(TOKEN);
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

    describe("enableSubmit()", () => {
        it("should set isSubmitActive to true", () => {
            const expected = true;
            const controller = new ResetPwdController(TOKEN);
            controller.isSubmitActive.set(false);
            controller.enableSubmit();
            const actual = controller.isSubmitActive.value;
            expect(actual).toEqual(expected);
        });
    });

    describe("disableSubmit()", () => {
        it("should set isSubmitActive to false", () => {
            const expected = false;
            const controller = new ResetPwdController(TOKEN);
            controller.disableSubmit();
            const actual = controller.isSubmitActive.value;
            expect(actual).toEqual(expected);
        });
    });
});
