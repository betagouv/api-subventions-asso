import authPort from "$lib/resources/auth/auth.port";
import authService from "$lib/resources/auth/auth.service";
import crispService from "$lib/services/crisp.service";
import localStorageService from "$lib/services/localStorage.service";
import requestsService from "$lib/services/requests.service";
import { ReadStore } from "$lib/core/Store";
import { checkOrDropSearchHistory } from "$lib/services/searchHistory.service";

const mocks = vi.hoisted(() => {
    return {
        DEFAULT_ERROR_CODE: 49,
    };
});

vi.mock("dto", async () => {
    const actual = await vi.importActual("dto");
    return {
        ...actual,
        SignupErrorCodes: { EMAIL_NOT_VALID: mocks.DEFAULT_ERROR_CODE },
        ResetPasswordErrorCodes: { INTERNAL_ERROR: mocks.DEFAULT_ERROR_CODE },
        __esModule: true, // this property makes it work
    };
});
vi.mock("$lib/services/crisp.service");
vi.mock("$lib/services/localStorage.service", async () => {
    return {
        default: {
            getItem: vi.fn(() => new ReadStore(undefined)),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        },
    };
});
vi.mock("$lib/services/router.service");
vi.mock("$lib/services/requests.service");
vi.mock("$lib/services/searchHistory.service");

describe("authService", () => {
    describe("signup()", () => {
        const portMock = vi.spyOn(authPort, "signup");
        const RES = {};
        const USER = { email: "test@mail.fr", lastname: "", firstname: "" };

        beforeAll(() => {
            portMock.mockResolvedValue(RES);
        });
        afterAll(() => portMock.mockRestore());

        it("rejects with appropriate code if no email", async () => {
            const test = () => authService.signup();
            await expect(test).rejects.toBe(mocks.DEFAULT_ERROR_CODE);
        });

        it("calls port", async () => {
            await authService.signup(USER);
            expect(portMock).toHaveBeenCalledWith(USER);
        });

        it("return result from port if success", async () => {
            const expected = RES;
            const actual = await authService.signup(USER);
            expect(expected).toBe(actual);
        });

        it("rejects with error code from port if given", async () => {
            const expected = { message: 5 };
            portMock.mockRejectedValueOnce(expected);
            const actual = authService.signup(USER);
            await expect(actual).rejects.toBe(expected);
        });
    });

    describe("resetPassword()", () => {
        const portMock = vi.spyOn(authPort, "resetPassword");
        const RES = true;
        const PASSWORD = "very secret";
        const TOKEN = "123";

        beforeAll(() => {
            portMock.mockResolvedValue(true);
        });
        afterAll(() => portMock.mockRestore());

        it("rejects with appropriate code if no token", async () => {
            const test = () => authService.resetPassword();
            await expect(test).rejects.toBe(mocks.DEFAULT_ERROR_CODE);
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
    });

    describe("forgetPassword()", () => {
        let portMock;
        const RES = true;
        const EMAIL = "test@test.fr";

        beforeAll(() => {
            portMock = vi.spyOn(authPort, "forgetPassword").mockResolvedValue(true);
        });
        afterAll(() => portMock.mockRestore());

        it("rejects if no email", async () => {
            const test = () => authService.forgetPassword();
            await expect(test).rejects.toBeUndefined();
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
    });

    describe("login()", () => {
        const mockPort = vi.spyOn(authPort, "login");
        let mockServiceLogin;

        beforeAll(() => {
            mockServiceLogin = vi.spyOn(authService, "loginByUser").mockImplementation(vi.fn());
        });
        afterAll(() => mockServiceLogin.mockRestore());

        it("should call port", async () => {
            const expected = ["test@datasubvention.beta.gouv.fr", "fake-password"];
            mockPort.mockResolvedValueOnce({});
            await authService.login(...expected);
            expect(mockPort).toHaveBeenCalledWith(...expected);
        });

        it("should call front login with given user", async () => {
            const expected = ["test@datasubvention.beta.gouv.fr", "fake-password"];
            mockPort.mockResolvedValueOnce({});
            await authService.login(...expected);
            expect(mockPort).toHaveBeenCalledWith(...expected);
        });
    });

    describe("loginByUser()", () => {
        const EMAIL = "a@b.c";
        const user = { _id: "USER_ID", email: EMAIL };

        it("calls checkOrDropSearchHistory", async () => {
            await authService.loginByUser(user);
            expect(checkOrDropSearchHistory).toHaveBeenCalledWith(user._id);
        });

        it("should save user in local storage", async () => {
            await authService.loginByUser(user);
            expect(localStorageService.setItem).toHaveBeenCalledWith(authService.USER_LOCAL_STORAGE_KEY, user);
        });

        it("sets crisp email value", async () => {
            await authService.loginByUser(user);
            expect(crispService.setUserEmail).toBeCalledWith(EMAIL);
        });

        it("should return user", async () => {
            const expected = user;
            const actual = await authService.loginByUser(user);
            expect(actual).toEqual(expected);
        });
    });

    describe("initUserInApp", () => {
        const crispServiceMock = vi.spyOn(crispService, "setUserEmail").mockImplementation(vi.fn());
        const getCurrentUserMock = vi.spyOn(authService, "getCurrentUser");

        afterAll(() => {
            getCurrentUserMock.mockRestore();
        });

        it("sets crisp email value", () => {
            const EMAIL = "a@b.c";
            getCurrentUserMock.mockReturnValueOnce({ email: EMAIL });
            authService.initUserInApp();
            expect(crispServiceMock).toBeCalledWith(EMAIL);
        });
    });

    describe("logout", () => {
        it("should call removeItem on localStorage", () => {
            authService.logout();

            expect(localStorageService.removeItem).toBeCalledWith(authService.USER_LOCAL_STORAGE_KEY);
        });

        it("resets crisp session", () => {
            authService.logout();
            expect(crispService.resetSession).toBeCalled();
        });
    });

    describe("getCurrentUser", () => {
        it("should call getItem on localStorage", () => {
            authService.getCurrentUser();

            expect(localStorageService.getItem).toBeCalledWith(authService.USER_LOCAL_STORAGE_KEY);
        });
    });
});
