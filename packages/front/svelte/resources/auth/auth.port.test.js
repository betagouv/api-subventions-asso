import axios from "axios";
import authPort from "./auth.port";

const DEFAULT_ERROR_CODE = 49;

jest.mock("@api-subventions-asso/dto", () => ({
    SignupErrorCodes: { CREATION_ERROR: DEFAULT_ERROR_CODE },
    ResetPasswordErrorCodes: { INTERNAL_ERROR: DEFAULT_ERROR_CODE },
    __esModule: true // this property makes it work
}));

describe("AuthPort", () => {
    describe("signup()", () => {
        const axiosPostMock = jest.spyOn(axios, "post");
        const EMAIL = "test@mail.fr";

        it("calls signup route", async () => {
            const PATH = "/auth/signup";
            axiosPostMock.mockResolvedValueOnce({ data: {} });
            await authPort.signup(EMAIL);
            expect(axiosPostMock).toBeCalledWith(PATH, { email: EMAIL });
        });

        it("returns email if success", async () => {
            axiosPostMock.mockResolvedValueOnce({ data: { email: EMAIL } });
            const actual = await authPort.signup(EMAIL);
            const expected = EMAIL;
            expect(actual).toBe(expected);
        });

        it("throws error with error code if any", () => {
            const ERROR_CODE = 42;
            axiosPostMock.mockRejectedValueOnce({ response: { data: { errorCode: ERROR_CODE } } });
            const expected = new Error(ERROR_CODE);
            expect(async () => authPort.signup(EMAIL)).rejects.toThrowError(expected);
        });

        it("throws error with default code if none received", () => {
            axiosPostMock.mockRejectedValueOnce(undefined);
            const expected = new Error(DEFAULT_ERROR_CODE);
            expect(async () => authPort.signup(EMAIL)).rejects.toThrowError(expected);
        });
    });

    describe("resetPassword()", () => {
        const axiosPostMock = jest.spyOn(axios, "post");
        const RES = true;
        const PASSWORD = "very secret";
        const TOKEN = "123";

        it("calls resetPassword route", async () => {
            const PATH = "/auth/reset-password";
            axiosPostMock.mockResolvedValueOnce({ data: {} });
            await authPort.resetPassword(TOKEN, PASSWORD);
            expect(axiosPostMock).toBeCalledWith(PATH, { token: TOKEN, password: PASSWORD });
        });

        it("returns true if success", async () => {
            axiosPostMock.mockResolvedValueOnce({ data: {} });
            const actual = await authPort.resetPassword(TOKEN, PASSWORD);
            const expected = RES;
            expect(actual).toBe(expected);
        });

        it("throws error with error code if any", () => {
            const ERROR_CODE = 42;
            axiosPostMock.mockRejectedValueOnce({ response: { data: { code: ERROR_CODE } } });
            const expected = new Error(ERROR_CODE);
            expect(async () => authPort.resetPassword(TOKEN, PASSWORD)).rejects.toThrowError(expected);
        });

        it("throws error with default code if none received", () => {
            axiosPostMock.mockRejectedValueOnce(undefined);
            const expected = new Error(DEFAULT_ERROR_CODE);
            expect(async () => authPort.resetPassword(TOKEN, PASSWORD)).rejects.toThrowError(expected);
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

        it("returns axios promise if fails", () => {
            const FAILURE = {};
            const expected = FAILURE;
            axiosPostMock.mockRejectedValueOnce(FAILURE);
            expect(async () => authPort.forgetPassword(EMAIL)).rejects.toEqual(expected);
        });
    });
});
