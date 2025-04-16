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

    describe("loginAgentConnect()", () => {
        const SEARCH_QUERIES = "?some=thing";

        it("calls signup route", async () => {
            const BASE_PATH = "/auth/ac/login";
            const expected = BASE_PATH + SEARCH_QUERIES;
            vi.mocked(requestsService.get).mockResolvedValueOnce({ data: {} });
            await authPort.loginAgentConnect(SEARCH_QUERIES);
            expect(requestsService.get).toBeCalledWith(expected);
        });

        it("returns user if success", async () => {
            const USER = "USER";
            vi.mocked(requestsService.get).mockResolvedValueOnce({ data: { user: USER } });
            const expected = USER;
            const actual = await authPort.loginAgentConnect(SEARCH_QUERIES);
            expect(actual).toBe(expected);
        });
    });

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

        it("returns true if success but no url", async () => {
            vi.mocked(requestsService.get).mockResolvedValueOnce({ data: "" });
            const expected = { success: true };
            const actual = await authPort.logout();
            expect(actual).toEqual(expected);
        });

        it("returns true if success with url", async () => {
            const URL = "somewhere.to.go";
            vi.mocked(requestsService.get).mockResolvedValueOnce({ data: URL });
            const expected = { success: true, url: "somewhere.to.go" };
            const actual = await authPort.logout();
            expect(actual).toEqual(expected);
        });

        it("returns false if failed", async () => {
            vi.mocked(requestsService.get).mockRejectedValueOnce(new Error("anything"));
            const expected = { success: false };
            const actual = await authPort.logout();
            expect(actual).toEqual(expected);
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
