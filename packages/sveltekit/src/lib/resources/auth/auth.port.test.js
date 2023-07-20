import axios from "axios";
import authPort from "./auth.port";
import requestsService from "$lib/services/requests.service";

const DEFAULT_ERROR_CODE = 49;

jest.mock("@api-subventions-asso/dto", () => ({
    SignupErrorCodes: { CREATION_ERROR: DEFAULT_ERROR_CODE },
    ResetPasswordErrorCodes: { INTERNAL_ERROR: DEFAULT_ERROR_CODE },
    __esModule: true, // this property makes it work
}));

describe("AuthPort", () => {
    describe("signup()", () => {
        const postMock = jest.spyOn(requestsService, "post");
        const USER = { email: "test@mail.fr", lastname: "", firstname: "" };

        it("calls signup route", async () => {
            const PATH = "/auth/signup";
            postMock.mockResolvedValueOnce({ data: {} });
            await authPort.signup(USER);
            expect(postMock).toBeCalledWith(PATH, {
                email: USER.email,
                lastName: USER.lastname,
                firstName: USER.firstname,
            });
        });

        it("returns email if success", async () => {
            postMock.mockResolvedValueOnce({ data: { email: USER.email } });
            const actual = await authPort.signup(USER);
            const expected = USER.email;
            expect(actual).toBe(expected);
        });
    });

    describe("resetPassword()", () => {
        const postMock = jest.spyOn(requestsService, "post");
        const RES = true;
        const PASSWORD = "very secret";
        const TOKEN = "123";

        it("calls resetPassword route", async () => {
            const PATH = "/auth/reset-password";
            postMock.mockResolvedValueOnce({ data: {} });
            await authPort.resetPassword(TOKEN, PASSWORD);
            expect(postMock).toBeCalledWith(PATH, { token: TOKEN, password: PASSWORD });
        });

        it("returns true if success", async () => {
            postMock.mockResolvedValueOnce({ data: {} });
            const actual = await authPort.resetPassword(TOKEN, PASSWORD);
            const expected = RES;
            expect(actual).toBe(expected);
        });
    });

    describe("login()", () => {
        const postMock = jest.spyOn(requestsService, "post");
        const EMAIL = "test@mail.fr";
        const PASSWORD = "FAKE_PASSWORD";

        it("calls signup route", async () => {
            const PATH = "/auth/login";
            postMock.mockResolvedValueOnce({ data: {} });
            await authPort.login(EMAIL, PASSWORD);
            expect(postMock).toBeCalledWith(PATH, { email: EMAIL, password: PASSWORD });
        });

        it("returns user if success", async () => {
            const expected = { email: EMAIL };
            postMock.mockResolvedValueOnce({ data: { user: expected } });
            const actual = await authPort.login(EMAIL, PASSWORD);
            expect(actual).toBe(expected);
        });
    });

    describe("forgetPassword()", () => {
        const axiosPostMock = jest.spyOn(axios, "post");
        const RES = true;
        const EMAIL = "test@mail.fr";

        it("calls forgetPassword route", async () => {
            const PATH = "/auth/forget-password";
            axiosPostMock.mockResolvedValueOnce({ data: {} });
            await authPort.forgetPassword(EMAIL);
            expect(axiosPostMock).toBeCalledWith(PATH, { email: EMAIL });
        });

        it("returns true if success", async () => {
            axiosPostMock.mockResolvedValueOnce({ data: {} });
            const expected = RES;
            const actual = await authPort.forgetPassword(EMAIL);
            expect(actual).toBe(expected);
        });
    });
});
