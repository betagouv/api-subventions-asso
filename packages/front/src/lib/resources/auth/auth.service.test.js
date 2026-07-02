import authPort from "$lib/resources/auth/auth.port";
import authService from "$lib/resources/auth/auth.service";
import crispService from "$lib/services/crisp.service";
import { ReadStore } from "$lib/core/Store";
import { checkOrDropSearchHistory } from "$lib/services/searchHistory.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import { goToUrl } from "$lib/services/router.service";
import userService from "$lib/resources/users/user.service";
import localStorageService from "$lib/services/localStorage.service";

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
vi.mock("$lib/resources/users/user.service");

describe("authService", () => {
    let connectedUserStoreSpy;
    beforeAll(() => {
        connectedUserStoreSpy = {
            set: vi.spyOn(authService.connectedUser, "set"),
            value: vi.spyOn(authService.connectedUser, "value", "get"),
        };
    });

    describe("resetPassword()", () => {
        const RES = true;
        const PASSWORD = "very secret";
        const TOKEN = "123";

        beforeAll(() => {
            authPort.resetPassword.mockResolvedValue(true);
        });
        afterAll(() => authPort.resetPassword.mockRestore());

        it("rejects with internal server error status if no token", async () => {
            const test = () => authService.resetPassword();
            await expect(test).rejects.toEqual({ httpCode: 500 });
        });

        it("calls port", async () => {
            await authService.resetPassword(TOKEN, PASSWORD);
            expect(authPort.resetPassword).toHaveBeenCalledWith(TOKEN, PASSWORD);
        });

        it("return result from port if success", async () => {
            const expected = RES;
            const actual = await authService.resetPassword(TOKEN, PASSWORD);
            expect(expected).toBe(actual);
        });
    });

    describe("forgetPassword()", () => {
        const RES = true;
        const EMAIL = "test@test.fr";

        beforeAll(() => authPort.forgetPassword.mockResolvedValue(true));
        afterAll(() => authPort.forgetPassword.mockRestore());

        it("rejects if no email", async () => {
            const test = () => authService.forgetPassword();
            await expect(test).rejects.toBeUndefined();
        });

        it("calls port", async () => {
            await authService.forgetPassword(EMAIL);
            expect(authPort.forgetPassword).toHaveBeenCalledWith(EMAIL);
        });

        it("return result from port if success", async () => {
            const expected = RES;
            const actual = await authService.forgetPassword(EMAIL);
            expect(actual).toBe(expected);
        });

        it("rejects if user is linked to proConnect", async () => {
            authPort.forgetPassword.mockResolvedValueOnce({ proConnectId: "something" });
            const test = () => authService.forgetPassword();
            await expect(test).rejects.toMatchInlineSnapshot(`undefined`);
        });
    });

    describe("login()", () => {
        let mockServiceLogin;

        beforeAll(() => {
            mockServiceLogin = vi.spyOn(authService, "loginByUser").mockImplementation(vi.fn());
        });
        afterAll(() => mockServiceLogin.mockRestore());

        it("should call port", async () => {
            const expected = ["test@datasubvention.beta.gouv.fr", "fake-password"];
            authPort.login.mockResolvedValueOnce({});
            await authService.login(...expected);
            expect(authPort.login).toHaveBeenCalledWith(...expected);
        });

        it("should call front login with given user", async () => {
            const USER = { some: "thing" };
            const expected = USER;
            const args = ["test@datasubvention.beta.gouv.fr", "fake-password"];
            authPort.login.mockResolvedValueOnce(USER);
            await authService.login(...args);
            expect(mockServiceLogin).toHaveBeenCalledWith(expected);
        });
    });

    describe("loginAgentConnect()", () => {
        let mockServiceLogin;
        const SEARCH_QUERY = "?some=thing";

        beforeAll(() => {
            mockServiceLogin = vi.spyOn(authService, "loginByUser").mockImplementation(vi.fn());
        });
        afterAll(() => mockServiceLogin.mockRestore());

        it("should call port", async () => {
            const expected = SEARCH_QUERY;
            authPort.loginAgentConnect.mockResolvedValueOnce({});
            await authService.loginAgentConnect(SEARCH_QUERY);
            expect(authPort.loginAgentConnect).toHaveBeenCalledWith(expected);
        });

        it("should call front login with given user", async () => {
            const USER = { some: "thing" };
            const expected = USER;
            authPort.loginAgentConnect.mockResolvedValueOnce(USER);
            await authService.loginAgentConnect(SEARCH_QUERY);
            expect(mockServiceLogin).toHaveBeenCalledWith(expected);
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
            await authService.loginByUser(user);
            expect(connectedUserStoreSpy.set).toHaveBeenCalledWith(user);
        });

        it("sets crisp email value", async () => {
            await authService.loginByUser(user);
            expect(crispService.setUserEmail).toBeCalledWith(EMAIL);
        });

        it("drops hide-main-info-banner from local storage", async () => {
            await authService.loginByUser(user);
            expect(vi.mocked(localStorageService).removeItem).toHaveBeenCalledWith("hide-main-info-banner");
        });

        it("should return user", async () => {
            const expected = user;
            const actual = await authService.loginByUser(user);
            expect(actual).toEqual(expected);
        });
    });

    describe("setUserInApp", () => {
        it("sets crisp email value", () => {
            const EMAIL = "a@b.c";
            authService.setUserInApp({ email: EMAIL }); // plus dans cette méthode
            expect(crispService.setUserEmail).toBeCalledWith(EMAIL);
        });
    });

    describe("controlAuth", () => {
        let getUserSpy;
        let mockIsAdmin;
        let mockGetSelfUser;
        let mockSetUserInApp;

        beforeAll(() => {
            mockSetUserInApp = vi.spyOn(authService, "setUserInApp").mockImplementation(vi.fn());
            mockIsAdmin = vi.spyOn(authService, "_isAdmin").mockReturnValue(true);
            getUserSpy = vi.spyOn(authService, "getCurrentUser");
            mockGetSelfUser = vi.spyOn(userService, "getSelfUser").mockResolvedValue({ email: "foo.bar@beta.gouv.fr" });
        });

        afterAll(() => [mockIsAdmin, getUserSpy, mockSetUserInApp].forEach(mock => mock.mockRestore()));

        async function correctReturn(requiredLevel, user, expected) {
            if (user) getUserSpy.mockReturnValueOnce(user);
            const actual = await authService.controlAuth(requiredLevel);
            expect(actual).toBe(expected);
        }

        it("returns true if no auth needed", async () => {
            return await correctReturn(AuthLevels.NONE, undefined, true);
        });

        it("try to get user if already connected", async () => {
            getUserSpy.mockReturnValueOnce(undefined);
            await authService.controlAuth(AuthLevels.USER);
            expect(mockGetSelfUser).toHaveBeenCalled();
        });

        it("calls redirectToLogin if not recently connected", async () => {
            getUserSpy.mockReturnValueOnce(undefined);
            vi.spyOn(userService, "getSelfUser").mockRejectedValue(new Error("401 Error"));
            const redirectSpy = vi.spyOn(authService, "redirectToLogin").mockResolvedValueOnce(true);
            await authService.controlAuth(AuthLevels.USER);
            expect(redirectSpy).toHaveBeenCalled();
        });

        it("redirect to home if user not admin and admin required", () => {
            mockIsAdmin.mockReturnValueOnce(false);
            getUserSpy.mockReturnValueOnce({ roles: [] });
            authService.controlAuth(AuthLevels.ADMIN);
            expect(goToUrl).toHaveBeenCalledWith("/");
        });

        it("returns true if user is admin and admin required", () => {
            correctReturn(AuthLevels.ADMIN, { roles: ["admin"] }, true);
        });

        it("returns true if user is not admin and simple user required", () => {
            correctReturn(AuthLevels.USER, { roles: [] }, true);
        });
    });

    describe("_isAdmin", () => {
        const USER = { email: "test@mail.fr", lastname: "", firstname: "", roles: ["user", "admin"] };
        it("should return true", () => {
            const expected = true;
            const actual = authService._isAdmin(USER);
            expect(actual).toEqual(expected);
        });
        it("should return false", () => {
            const expected = false;
            const actual = authService._isAdmin({ ...USER, roles: ["user"] });
            expect(actual).toEqual(expected);
        });
    });

    describe("logout", () => {
        beforeAll(() => {
            authPort.logout.mockResolvedValue({ success: true });
        });

        afterAll(() => {
            authPort.logout.mockRestore();
        });

        it("should call authPort.logout", async () => {
            await authService.logout();
            expect(authPort.logout).toHaveBeenCalled();
        });

        it("should call remove user from store", async () => {
            await authService.logout();
            expect(connectedUserStoreSpy.set).toHaveBeenCalledWith(null);
        });

        it("resets crisp session", async () => {
            await authService.logout();
            expect(crispService.resetSession).toHaveBeenCalled();
        });

        it("redirects to login page", async () => {
            await authService.logout();
            expect(goToUrl).toHaveBeenCalledWith("/auth/login", false);
        });

        it("redirects to received URL", async () => {
            const URL = "go.somewhere";
            authPort.logout.mockResolvedValue({ success: true, url: URL });
            await authService.logout();
            expect(goToUrl).toHaveBeenCalledWith(URL);
        });
    });

    describe("getCurrentUser", () => {
        it("should get store value", () => {
            authService.getCurrentUser();

            expect(connectedUserStoreSpy.value).toHaveBeenCalled();
        });
    });

    describe("redirectToLogin", () => {
        it("saves object", () => {
            authService.redirectToLogin();
            const actual = vi.mocked(localStorageService.setItem).mock.calls[0];
            expect(actual).toMatchObject(["redirectUrl", { url: "/", setDate: expect.any(Date) }]);
        });

        it("redirects to login", () => {
            authService.redirectToLogin();
            expect(goToUrl).toHaveBeenCalledWith("/auth/login");
        });
    });

    describe("redirectAfterLogin", () => {
        beforeAll(() => {
            vi.mocked(localStorageService.getItem).mockReturnValue({ value: null });
        });
        afterAll(() => {
            vi.mocked(localStorageService.getItem).mockRestore();
        });
        it("gets saved redirect url with default arg", () => {
            authService.redirectAfterLogin();
            expect(vi.mocked(localStorageService.getItem)).toHaveBeenCalledWith("redirectUrl", null);
        });

        it("if no redirect url return to /", () => {
            authService.redirectAfterLogin();
            expect(vi.mocked(goToUrl)).toHaveBeenCalledWith("/");
        });

        it("removes saved redirect url", () => {
            vi.mocked(localStorageService.getItem).mockReturnValueOnce({ value: "something" });
            authService.redirectAfterLogin();
            expect(vi.mocked(localStorageService.removeItem)).toHaveBeenCalledWith("redirectUrl");
        });

        it("if too old url return to /", () => {
            vi.mocked(localStorageService.getItem).mockReturnValueOnce({ value: { setDate: "2022-02-02" } });
            authService.redirectAfterLogin();
            expect(vi.mocked(goToUrl)).toHaveBeenCalledWith("/", true, true);
        });

        it("if recent enough url return to url", () => {
            const URL = "/somewhere";
            vi.mocked(localStorageService.getItem).mockReturnValueOnce({
                value: { setDate: new Date(), url: URL },
            });
            authService.redirectAfterLogin();
            expect(vi.mocked(goToUrl)).toHaveBeenCalledWith(URL);
        });
    });
});
