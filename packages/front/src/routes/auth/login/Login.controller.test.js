import { LoginDtoErrorCodes } from "dto";
import LoginController from "./Login.controller";
import UnauthorizedError from "$lib/errors/UnauthorizedError";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service";

vi.mock("$lib/resources/auth/auth.service");
vi.mock("$lib/services/router.service");

describe("LoginController", () => {
    let controller;

    beforeEach(() => {
        controller = new LoginController({});
    });

    describe("submit", () => {
        beforeEach(() => {
            controller.password = PASSWORD;
            controller.email = EMAIL;
        });

        const EMAIL = "test@datasubvention.beta.gouv.fr";
        const PASSWORD = "FAKE_PASSWORD";

        it("should call login", async () => {
            authService.login.mockResolvedValueOnce({});

            await controller.submit();
            expect(authService.login).toHaveBeenCalledWith(EMAIL, PASSWORD);
        });

        it("should call goToUrl", async () => {
            authService.login.mockResolvedValueOnce({});
            await controller.submit();
            expect(authService.redirectAfterLogin).toHaveBeenCalled();
        });

        it("should call getErrorMessage", async () => {
            const expected = 1;
            authService.login.mockRejectedValueOnce(new UnauthorizedError({ code: expected }));
            const getErrorMessageMock = vi.spyOn(controller, "_getErrorMessage").mockReturnValue("");
            await controller.submit();
            expect(getErrorMessageMock).toHaveBeenCalledWith(expected);
        });

        it("should call set message in error", async () => {
            const expected = "MESSAGE";
            authService.login.mockRejectedValueOnce(new UnauthorizedError({ code: 1 }));
            vi.spyOn(controller, "_getErrorMessage").mockReturnValueOnce(expected);
            await controller.submit();
            expect(controller.error.value).toBe(expected);
        });
    });

    describe("_getErrorMessage", () => {
        it("should return 'email passoword don't match' message", () => {
            const actual = controller._getErrorMessage(LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);
            const expected = "Mot de passe ou email incorrect";

            expect(actual).toBe(expected);
        });

        it("should return 'inactive' message", () => {
            const actual = controller._getErrorMessage(LoginDtoErrorCodes.USER_NOT_ACTIVE);
            const expected =
                "Votre compte ne semble pas encore activé, si vous ne retrouvez pas votre mail d'activation vous pouvez faire mot de passe oublié.";

            expect(actual).toBe(expected);
        });

        it("should return default message", () => {
            const actual = controller._getErrorMessage(Infinity);
            const expected = "Une erreur interne est survenue, veuillez réessayer plus tard.";

            expect(actual).toBe(expected);
        });
    });

    describe("_getSuccessMessage", () => {
        it("should return 'activated account' message", () => {
            controller._query.success = "ACCOUNT_ACTIVATED";
            const actual = controller._getSuccessMessage();
            const expected = "Votre compte a bien été activé, vous pouvez maintenant vous connecter";

            expect(actual).toBe(expected);
        });

        it("should return 'password changed' message", () => {
            controller._query.success = "OTHER";
            const actual = controller._getSuccessMessage();
            const expected = "Votre mot de passe a bien été changé";

            expect(actual).toBe(expected);
        });
    });

    describe("_proceedWithAgentConnect", () => {
        const QUERY_STRING = "?some=thing";

        it("calls agent connect login", async () => {
            await controller._proceedWithAgentConnect(QUERY_STRING);
            expect(authService.loginAgentConnect).toHaveBeenCalledWith(QUERY_STRING);
        });

        it("redirects to home", async () => {
            await controller._proceedWithAgentConnect(QUERY_STRING);
            expect(authService.redirectAfterLogin).toHaveBeenCalled();
        });

        it("sets retrieved error message", async () => {
            const MESSAGE = "c'est une erreur";
            vi.spyOn(controller, "_getErrorMessage").mockReturnValueOnce(MESSAGE);
            const setErrorSpy = vi.spyOn(controller.error, "set");
            authService.loginAgentConnect.mockRejectedValueOnce(new Error({ data: {} }));
            await controller._proceedWithAgentConnect(QUERY_STRING);
            expect(setErrorSpy).toHaveBeenCalledWith(MESSAGE);
        });
    });
});
