import authPort from "./auth.port";
import requestsService from "@services/requests.service";

const DEFAULT_ERROR_CODE = 49;

jest.mock("@api-subventions-asso/dto", () => ({
    SignupErrorCodes: { CREATION_ERROR: DEFAULT_ERROR_CODE },
    ResetPasswordErrorCodes: { INTERNAL_ERROR: DEFAULT_ERROR_CODE },
    __esModule: true, // this property makes it work
}));

jest.mock("@services/requests.service");

describe("AuthPort", () => {
    describe("signup()", () => {
        const USER = { email: "test@mail.fr", lastname: "", firstname: "" };

        it("calls signup route", async () => {
            const PATH = "/auth/signup";
            requestsService.post.mockResolvedValueOnce({ data: {} });
            await authPort.signup(USER);
            expect(requestsService.post).toBeCalledWith(PATH, {
                email: USER.email,
                lastName: USER.lastname,
                firstName: USER.firstname,
            });
        });

        it("returns email if success", async () => {
            requestsService.post.mockResolvedValueOnce({ data: { email: USER.email } });
            const actual = await authPort.signup(USER);
            const expected = USER.email;
            expect(actual).toBe(expected);
        });
    });

    describe("resetPassword()", () => {
        const RES = true;
        const PASSWORD = "very secret";
        const TOKEN = "123";

        it("calls resetPassword route", async () => {
            const PATH = "/auth/reset-password";
            requestsService.post.mockResolvedValueOnce({ data: {} });
            await authPort.resetPassword(TOKEN, PASSWORD);
            expect(requestsService.post).toBeCalledWith(PATH, { token: TOKEN, password: PASSWORD });
        });

        it("returns true if success", async () => {
            requestsService.post.mockResolvedValueOnce({ data: {} });
            const expected = RES;
            const actual = await authPort.resetPassword(TOKEN, PASSWORD);
            expect(actual).toBe(expected);
        });
    });

    describe("login()", () => {
        const EMAIL = "test@mail.fr";
        const PASSWORD = "FAKE_PASSWORD";

        it("calls signup route", async () => {
            const PATH = "/auth/login";
            requestsService.post.mockResolvedValueOnce({ data: {} });
            await authPort.login(EMAIL, PASSWORD);
            expect(requestsService.post).toBeCalledWith(PATH, { email: EMAIL, password: PASSWORD });
        });

        it("returns user if success", async () => {
            const expected = { email: EMAIL };
            requestsService.post.mockResolvedValueOnce({ data: { user: expected } });
            const actual = await authPort.login(EMAIL, PASSWORD);
            expect(actual).toBe(expected);
        });
    });

    describe("forgetPassword()", () => {
        const RES = true;
        const EMAIL = "test@mail.fr";

        it("calls forgetPassword route", async () => {
            const PATH = "/auth/forget-password";
            requestsService.post.mockResolvedValueOnce({ data: {} });
            await authPort.forgetPassword(EMAIL);
            expect(requestsService.post).toBeCalledWith(PATH, { email: EMAIL });
        });

        it("returns true if success", async () => {
            requestsService.post.mockResolvedValueOnce({ data: {} });
            const expected = RES;
            const actual = await authPort.forgetPassword(EMAIL);
            expect(actual).toBe(expected);
        });
    });
});
