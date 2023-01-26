import authPort from "@resources/auth/auth.port";
import authService from "@resources/auth/auth.service";

const DEFAULT_ERROR_CODE = 49;

jest.mock("@api-subventions-asso/dto/build/auth/SignupDtoResponse", () => ({
    SignupErrorCodes: {
        EMAIL_NOT_VALID: DEFAULT_ERROR_CODE
    },
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
});
