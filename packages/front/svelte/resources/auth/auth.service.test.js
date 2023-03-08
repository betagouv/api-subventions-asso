import axios from "axios";
import authPort from "@resources/auth/auth.port";
import authService from "@resources/auth/auth.service";

const DEFAULT_ERROR_CODE = 49;

jest.mock("@api-subventions-asso/dto", () => ({
    SignupErrorCodes: { EMAIL_NOT_VALID: DEFAULT_ERROR_CODE },
    ResetPasswordErrorCodes: { INTERNAL_ERROR: DEFAULT_ERROR_CODE },
    __esModule: true // this property makes it work
}));

describe("authService", () => {
    describe("signup()", () => {
        const portMock = jest.spyOn(authPort, "signup");
        const RES = {};
        const EMAIL = "test@mail.fr";

        beforeAll(() => portMock.mockResolvedValue(RES));
        afterAll(() => portMock.mockRestore());

        it("rejects with appropriate code if no email", () => {
            const test = () => authService.signup();
            expect(test).rejects.toBe(DEFAULT_ERROR_CODE);
        });

        it("calls port", async () => {
            await authService.signup(EMAIL);
            expect(portMock).toHaveBeenCalledWith(EMAIL);
        });

        it("return result from port if success", async () => {
            const expected = RES;
            const actual = await authService.signup(EMAIL);
            expect(expected).toBe(actual);
        });

        it("rejects with error code from port if given", () => {
            const ERROR_CODE = 5;
            portMock.mockRejectedValueOnce({ message: ERROR_CODE.toString() });
            const expected = ERROR_CODE;
            const actual = authService.signup(EMAIL);
            expect(actual).rejects.toBe(expected);
        });
    });

    describe("resetPassword()", () => {
        const portMock = jest.spyOn(authPort, "resetPassword");
        const RES = true;
        const PASSWORD = "very secret";
        const TOKEN = "123";

        beforeAll(() => portMock.mockResolvedValue(true));
        afterAll(() => portMock.mockRestore());

        it("rejects with appropriate code if no token", () => {
            const test = () => authService.resetPassword();
            expect(test).rejects.toBe(DEFAULT_ERROR_CODE);
        });

        it("calls port", async () => {
            await authService.resetPassword(TOKEN, PASSWORD);
            expect(portMock).toHaveBeenCalledWith(TOKEN, PASSWORD);
        });

        it("return result from port if success", async () => {
            const expected = RES;
            const actual = await authService.resetPassword(TOKEN, PASSWORD);
            expect(expected).toBe(actual);
        });

        it("rejects with error code from port if given", () => {
            const ERROR_CODE = 5;
            portMock.mockRejectedValueOnce({ message: ERROR_CODE.toString() });
            const expected = ERROR_CODE;
            const actual = authService.resetPassword(TOKEN, PASSWORD);
            expect(actual).rejects.toBe(expected);
        });
    });

    describe("forgetPassword()", () => {
        const portMock = jest.spyOn(authPort, "forgetPassword");
        const RES = true;
        const EMAIL = "test@test.fr";

        beforeAll(() => portMock.mockResolvedValue(true));
        afterAll(() => portMock.mockRestore());

        it("rejects if no email", () => {
            const test = () => authService.forgetPassword();
            expect(test).rejects.toBeUndefined();
        });

        it("calls port", async () => {
            await authService.forgetPassword(EMAIL);
            expect(portMock).toHaveBeenCalledWith(EMAIL);
        });

        it("return result from port if success", async () => {
            const expected = RES;
            const actual = await authService.forgetPassword(EMAIL);
            expect(expected).toBe(actual);
        });

        it("rejects with error code from port if given", () => {
            portMock.mockRejectedValueOnce(undefined);
            const actual = authService.forgetPassword(EMAIL);
            expect(actual).rejects.toBeUndefined();
        });
    });

    describe("login()", () => {
        const portMock = jest.spyOn(authPort, "login");
        it("should call port", async () => {
            const expected = ["test@datasubvention.beta.gouv.fr", "fake-password"];

            portMock.mockResolvedValueOnce({});

            await authService.login(...expected);
            expect(portMock).toHaveBeenCalledWith(...expected);
        });

        it("should save user in local storage", async () => {
            const expected = { _id: "USER_ID" };

            portMock.mockResolvedValueOnce(expected);

            await authService.login("", "");
            const actual = JSON.parse(localStorage.getItem(authService.USER_LOCAL_STORAGE_KEY));
            expect(actual).toEqual(expected);
        });

        it("should return user", async () => {
            const expected = { _id: "USER_ID" };

            portMock.mockResolvedValueOnce(expected);

            const actual = await authService.login("", "");
            expect(actual).toEqual(expected);
        });
    });

    describe("initUserInApp", () => {
        const getCurrentUserMock = jest.spyOn(authService, "getCurrentUser");

        afterAll(() => {
            getCurrentUserMock.mockRestore();
        });

        it("should be axios header", async () => {
            const expected = "FAKE_TOKEN";
            getCurrentUserMock.mockReturnValueOnce({ jwt: { token: expected } });

            await authService.initUserInApp();
            const actual = axios.defaults.headers.common["x-access-token"];

            expect(actual).toBe(expected);
        });
    });

    describe("logout", () => {
        // Use Storage.prototype because localstorage mock not work. See https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
        const localStorageMock = jest.spyOn(Storage.prototype, "removeItem");
        it("should call removeItem on localStorage", () => {
            authService.logout();

            expect(localStorageMock).toBeCalledWith(authService.USER_LOCAL_STORAGE_KEY);
        });
    });

    describe("getCurrentUser", () => {
        // Use Storage.prototype because localstorage mock not work. See https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
        const localStorageMock = jest.spyOn(Storage.prototype, "getItem");
        it("should call getItem on localStorage", () => {
            authService.getCurrentUser();

            expect(localStorageMock).toBeCalledWith(authService.USER_LOCAL_STORAGE_KEY);
        });
    });
});
