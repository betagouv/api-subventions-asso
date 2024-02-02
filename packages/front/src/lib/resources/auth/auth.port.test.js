import authPort from "./auth.port";
import requestsService from "$lib/services/requests.service";

const DEFAULT_ERROR_CODE = 49;

vi.mock("dto", () => ({
    SignupErrorCodes: { CREATION_ERROR: DEFAULT_ERROR_CODE },
    ResetPasswordErrorCodes: { INTERNAL_ERROR: DEFAULT_ERROR_CODE },
    __esModule: true, // this property makes it work
}));

vi.mock("$lib/services/requests.service");

describe("AuthPort", () => {
    describe("signup()", () => {
        const USER = { email: "test@mail.fr", lastname: "", firstname: "" };

        it("calls signup route", async () => {
            const PATH = "/auth/signup";
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: {} });
            await authPort.signup(USER);
            expect(requestsService.post).toBeCalledWith(PATH, {
                email: USER.email,
                lastName: USER.lastname,
                firstName: USER.firstname,
            });
        });

        it("returns email if success", async () => {
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: { email: USER.email } });
            const actual = await authPort.signup(USER);
            const expected = USER.email;
            expect(actual).toBe(expected);
        });
    });

    describe("resetPassword()", () => {
        const PASSWORD = "very secret";
        const TOKEN = "123";

        it("calls resetPassword route", async () => {
            const PATH = "/auth/reset-password";
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: { user: {} } });
            await authPort.resetPassword(TOKEN, PASSWORD);
            expect(requestsService.post).toBeCalledWith(PATH, { token: TOKEN, password: PASSWORD });
        });

        it("returns user if success", async () => {
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: { user: {} } });
            const actual = await authPort.resetPassword(TOKEN, PASSWORD);
            expect(actual).toEqual({});
        });
    });

    describe("login()", () => {
        const EMAIL = "test@mail.fr";
        const PASSWORD = "FAKE_PASSWORD";

        it("calls signup route", async () => {
            const PATH = "/auth/login";
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: {} });
            await authPort.login(EMAIL, PASSWORD);
            expect(requestsService.post).toBeCalledWith(PATH, { email: EMAIL, password: PASSWORD });
        });

        it("returns user if success", async () => {
            const expected = { email: EMAIL };
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: { user: expected } });
            const actual = await authPort.login(EMAIL, PASSWORD);
            expect(actual).toBe(expected);
        });
    });

    // TODO new tests login

    describe("forgetPassword()", () => {
        const RES = true;
        const EMAIL = "test@mail.fr";

        it("calls forgetPassword route", async () => {
            const PATH = "/auth/forget-password";
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: {} });
            await authPort.forgetPassword(EMAIL);
            expect(requestsService.post).toBeCalledWith(PATH, { email: EMAIL });
        });

        it("returns true if success", async () => {
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: {} });
            const expected = RES;
            const actual = await authPort.forgetPassword(EMAIL);
            expect(actual).toBe(expected);
        });
    });

    describe("logout()", () => {
        it("calls logout route", async () => {
            const PATH = "/auth/logout";
            vi.mocked(requestsService.get).mockResolvedValueOnce(true);
            await authPort.logout();
            expect(requestsService.get).toBeCalledWith(PATH);
        });

        it("returns true if success", async () => {
            vi.mocked(requestsService.get).mockResolvedValueOnce("anything");
            const expected = true;
            const actual = await authPort.logout();
            expect(actual).toBe(expected);
        });

        it("returns false if failed", async () => {
            vi.mocked(requestsService.get).mockRejectedValueOnce(new Error("anything"));
            const expected = false;
            const actual = await authPort.logout();
            expect(actual).toBe(expected);
        });
    });

    describe("activate", () => {
        const FAKE_TOKEN = "activation token";
        const DATA = { USER: "" };

        it("calls activate route", async () => {
            const PATH = "/auth/activate";
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: { user: {} } });
            await authPort.activate(FAKE_TOKEN, DATA);
            expect(requestsService.post).toBeCalledWith(PATH, { token: FAKE_TOKEN, data: DATA });
        });

        it("returns user if success", async () => {
            vi.mocked(requestsService.post).mockResolvedValueOnce({ data: { user: {} } });
            const actual = await authPort.activate(FAKE_TOKEN, DATA);
            expect(actual).toEqual({});
        });
    });
});
