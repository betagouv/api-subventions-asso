import userCheckService from "./user.check.service";
import { UserServiceErrors } from "../../user.service";
import configurationsService from "../../../configurations/configurations.service";
import { BadRequestError } from "../../../../shared/errors/httpErrors";
jest.mock("../../../configurations/configurations.service");
const mockedConfigurationsService = jest.mocked(configurationsService);

describe("user check service", () => {
    describe("passwordValidator", () => {
        it("should accept #", () => {
            const actual = userCheckService.passwordValidator("Aa12345#");
            expect(actual).toEqual(true);
        });

        it("should reject because no number in password", () => {
            expect(userCheckService.passwordValidator("AAAAAAAaaaaaa;;;;")).toBe(false);
        });

        it("should reject because no char (Uppercase) in password", () => {
            expect(userCheckService.passwordValidator("11111aaaaaa;;;;")).toBe(false);
        });

        it("should reject because no char (Lowercase) in password", () => {
            expect(userCheckService.passwordValidator("11111AAAAA;;;;")).toBe(false);
        });

        it("should reject because no special char in password", () => {
            expect(userCheckService.passwordValidator("11111AAAAAaaaaaa")).toBe(false);
        });

        it("should reject because length is to short in password", () => {
            expect(userCheckService.passwordValidator("Aa1;")).toBe(false);
        });

        it("should reject because length is to big in password", () => {
            expect(
                userCheckService.passwordValidator(
                    "Aa1;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                ),
            ).toBe(false);
        });

        it("should accept", () => {
            expect(userCheckService.passwordValidator("SUPER;test::12345678")).toBe(true);
        });
    });

    describe("validateEmail()", () => {
        mockedConfigurationsService.isDomainAccepted.mockImplementation(async () => true);
        const EMAIL = "daemon.targaryen@ac-pentos.ws";

        it("should verify domain", async () => {
            await userCheckService.validateEmail(EMAIL);
            expect(mockedConfigurationsService.isDomainAccepted).toHaveBeenCalledWith(EMAIL);
        });

        it("should return if email is correct", async () => {
            await userCheckService.validateEmail(EMAIL);
        });

        it("should throw error if not well formatted", async () => {
            const expected = new BadRequestError("Email is not valid");
            expect(() => userCheckService.validateEmail("ab1")).rejects.toThrowError(expected);
        });

        it("should throw error if domain not accepted", async () => {
            mockedConfigurationsService.isDomainAccepted.mockImplementationOnce(async () => false);
            const expected = {
                message: "Email domain is not accepted",
                code: UserServiceErrors.CREATE_EMAIL_GOUV,
            };
            const test = () => userCheckService.validateEmail(EMAIL);
            await expect(test).rejects.toMatchObject(expected);
        });
    });
});
