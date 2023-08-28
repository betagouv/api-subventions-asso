import { LoginDtoErrorCodes } from "dto";
import LoginController from "./Login.controller";
import UnauthorizedError from "$lib/errors/UnauthorizedError";
import * as RouterService from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";

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

        const loginMock = vi.spyOn(authService, "login");
        const goToUrlMock = vi.spyOn(RouterService, "goToUrl");

        const EMAIL = "test@datasubvention.beta.gouv.fr";
        const PASSWORD = "FAKE_PASSWORD";

        it("should call login", async () => {
            loginMock.mockResolvedValueOnce({});

            await controller.submit();
            expect(loginMock).toHaveBeenCalledWith(EMAIL, PASSWORD);
        });

        it("should call goToUrl", async () => {
            loginMock.mockResolvedValueOnce({});
            await controller.submit();
            expect(goToUrlMock).toHaveBeenCalledWith("/", true, true);
        });

        it("should call goToUrl with url from query", async () => {
            loginMock.mockResolvedValueOnce({});
            const url = "/tada";
            const encodedUrl = "%2Ftada";

            const oldLocation = window.location;
            delete window.location;
            window.location = new URL(`${oldLocation.origin}${oldLocation.pathname}?url=${encodedUrl}`);
            await controller.submit();
            expect(goToUrlMock).toHaveBeenCalledWith(url, true, true);
        });

        it("should call getErrorMessage", async () => {
            const expected = 1;
            loginMock.mockRejectedValueOnce(new UnauthorizedError({ code: expected }));
            const getErrorMessageMock = vi.spyOn(controller, "_getErrorMessage").mockReturnValue("");
            await controller.submit();
            expect(getErrorMessageMock).toHaveBeenCalledWith(expected);
        });

        it("should call set message in error", async () => {
            const expected = "MESSAGE";
            loginMock.mockRejectedValueOnce(new UnauthorizedError({ code: 1 }));
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
});
