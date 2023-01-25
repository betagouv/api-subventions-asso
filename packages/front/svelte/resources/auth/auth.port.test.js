import axios from "axios";
import authPort from "./auth.port";

const DEFAULT_ERROR_CODE = 49;

jest.mock("@api-subventions-asso/dto/build/auth/SignupDtoResponse", () => ({
    SignupErrorCodes: {
        CREATION_ERROR: DEFAULT_ERROR_CODE
    },
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
});
