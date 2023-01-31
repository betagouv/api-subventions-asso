import authService from "@resources/auth/auth.service";
import LoginController from "./Login.controller";
import * as RouterService from "../../../services/router.service";
import UnauthoziedError from "../../../errors/UnauthorizedError";
import { LoginDtoErrorCodes } from "@api-subventions-asso/dto";

describe("LoginController", () => {
    let controller;

    beforeEach(() => {
        controller = new LoginController({});
        controller.formElt = {
            email: "",
            password: ""
        };
    });

    describe("submit", () => {
        const loginMock = jest.spyOn(authService, "login");
        const goToUrlMock = jest.spyOn(RouterService, "goToUrl");
        const formDataMock = jest.spyOn(global, "FormData").mockImplementation(data => new Map(Object.entries(data)));

        const EMAIL = "test@datasubvention.beta.gouv.fr";
        const PASSWORD = "FAKE_PASSWORD";

        const event = {
            preventDefault: jest.fn()
        };

        afterAll(() => {
            formDataMock.mockRestore();
        });

        it("should don't call login", async () => {
            controller.formElt = null;
            await controller.submit(event);

            expect(loginMock).toHaveBeenCalledTimes(0);
        });

        it("should call login", async () => {
            loginMock.mockResolvedValueOnce({});

            controller.formElt = {
                email: EMAIL,
                password: PASSWORD
            };

            await controller.submit(event);

            expect(loginMock).toHaveBeenCalledWith(EMAIL, PASSWORD);
        });

        it("should call goToUrl", async () => {
            loginMock.mockResolvedValueOnce({});

            controller.formElt = {
                email: EMAIL,
                password: PASSWORD
            };

            await controller.submit(event);

            expect(goToUrlMock).toHaveBeenCalledWith("/");
        });

        it("should call getErrorMessage", async () => {
            const expected = 1;
            loginMock.mockRejectedValueOnce(new UnauthoziedError({ code: expected }));
            const getErrorMessageMock = jest.spyOn(controller, "_getErrorMessage").mockReturnValue("");
            controller.formElt = {
                email: EMAIL,
                password: PASSWORD
            };

            await controller.submit(event);

            expect(getErrorMessageMock).toHaveBeenCalledWith(expected);
        });

        it("should call set message in error", async () => {
            const expected = "MESSAGE";
            loginMock.mockRejectedValueOnce(new UnauthoziedError({ code: 1 }));
            jest.spyOn(controller, "_getErrorMessage").mockReturnValueOnce(expected);
            controller.formElt = {
                email: EMAIL,
                password: PASSWORD
            };

            await controller.submit(event);

            expect(controller.error.value).toBe(expected);
        });
    });

    describe("_getErrorMessage", () => {
        it("sould return email passoword dont match message", () => {
            const actual = controller._getErrorMessage(LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);
            const expected = "Mot de passe ou email incorrect";

            expect(actual).toBe(expected);
        });

        it("sould return un active message", () => {
            const actual = controller._getErrorMessage(LoginDtoErrorCodes.USER_NOT_ACTIVE);
            const expected =
                "Votre compte ne semble pas encore activé, si vous ne retrouvez pas votre mail d'activation vous pouvez faire mot de passe oublié.";

            expect(actual).toBe(expected);
        });

        it("sould return default message", () => {
            const actual = controller._getErrorMessage(Infinity);
            const expected = "Une erreur interne est survenue, veuillez réessayer plus tard.";

            expect(actual).toBe(expected);
        });
    });

    describe("_getSuccessMessage", () => {
        it("sould actived acount message", () => {
            controller._query.success = "COMPTE_ACTIVED";
            const actual = controller._getSuccessMessage();
            const expected = "Votre compte a bien été activé, vous pouvez maintenant vous connecter";

            expect(actual).toBe(expected);
        });

        it("sould password message", () => {
            controller._query.success = "OTHER";
            const actual = controller._getSuccessMessage();
            const expected = "Votre mot de passe a bien été changé";

            expect(actual).toBe(expected);
        });
    });
});
