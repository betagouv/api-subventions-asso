import authPort from "$lib/resources/auth/auth.port";
import authService from "$lib/resources/auth/auth.service";
import crispService from "$lib/services/crisp.service";
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
vi.mock("$lib/resources/auth/auth.port");
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
            const expected = 5;
            const error = { data: { code: expected } };
            portMock.mockRejectedValueOnce(error);
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

        it("should save user in store", async () => {
            const mockedSet = vi.spyOn(authService.connectedUser, "set");
            await authService.loginByUser(user);
            expect(mockedSet).toHaveBeenCalledWith(user);
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

    describe("setUserInApp", () => {
        const crispServiceMock = vi.spyOn(crispService, "setUserEmail").mockImplementation(vi.fn());

        it("sets crisp email value", () => {
            const EMAIL = "a@b.c";
            authService.setUserInApp({ email: EMAIL }); // plus dans cette méthode
            expect(crispServiceMock).toBeCalledWith(EMAIL);
        });
    });

    describe("logout", () => {
        it("should call authPort.logout", async () => {
            await authService.logout();
            expect(authPort.logout).toHaveBeenCalled();
        });

        it("should call remove user from store", async () => {
            const mockedSet = vi.spyOn(authService.connectedUser, "set");
            await authService.logout();

            expect(mockedSet).toBeCalledWith(null);
        });

        it("resets crisp session", async () => {
            await authService.logout();
            expect(crispService.resetSession).toBeCalled();
        });
    });

    describe("getCurrentUser", () => {
        it("should call getItem on localStorage", () => {
            const mockedGet = vi.spyOn(authService.connectedUser, "value", "get");
            authService.getCurrentUser();

            expect(mockedGet).toHaveBeenCalled();
        });
    });
});
