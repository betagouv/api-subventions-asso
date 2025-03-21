import userCheckService from "./user.check.service";
import { BadRequestError } from "core";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import configurationsService from "../../../configurations/configurations.service";
jest.mock("../../../configurations/configurations.service");
const mockedConfigurationsService = jest.mocked(configurationsService);
import userPort from "../../../../dataProviders/db/user/user.port";
jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
import * as stringHelper from "../../../../shared/helpers/StringHelper";
jest.mock("../../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(stringHelper);
import userRolesService from "../roles/user.roles.service";
import { UserServiceErrors } from "../../user.enum";
jest.mock("../roles/user.roles.service");
const mockedUserRolesService = jest.mocked(userRolesService);

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

    describe("validateOnlyEmail()", () => {
        const EMAIL = "daemon.targaryen@ac-pentos.ws";

        it("should return if email is correct", () => {
            const actual = userCheckService.validateOnlyEmail(EMAIL);
            expect(actual).toBeUndefined();
        });

        it("should throw error if not well formatted", () => {
            const expected = new BadRequestError("Email is not valid");
            expect(() => userCheckService.validateOnlyEmail("ab1")).toThrowError(expected);
        });
    });

    describe("validateEmailAndDomain()", () => {
        mockedConfigurationsService.isDomainAccepted.mockImplementation(async () => true);
        let onlyEmailSpy: jest.SpyInstance;
        const EMAIL = "daemon.targaryen@ac-pentos.ws";

        beforeAll(() => {
            onlyEmailSpy = jest.spyOn(userCheckService, "validateOnlyEmail");
        });

        it("should call validateOnlyEmail", async () => {
            await userCheckService.validateEmailAndDomain(EMAIL);
            expect(onlyEmailSpy).toHaveBeenCalledWith(EMAIL);
        });

        it("should verify domain", async () => {
            await userCheckService.validateEmailAndDomain(EMAIL);
            expect(mockedConfigurationsService.isDomainAccepted).toHaveBeenCalledWith(EMAIL);
        });

        it("should throw error if domain not accepted", async () => {
            mockedConfigurationsService.isDomainAccepted.mockResolvedValueOnce(false);
            const expected = {
                message: "Email domain is not accepted",
                code: UserServiceErrors.CREATE_EMAIL_GOUV,
            };
            const test = () => userCheckService.validateEmailAndDomain(EMAIL);
            await expect(test).rejects.toMatchObject(expected);
        });
    });

    describe("validateSanitizeUser", () => {
        const mockValidateEmail = jest.spyOn(userCheckService, "validateEmailAndDomain");

        beforeAll(() => {
            mockedUserPort.findByEmail.mockResolvedValue(null);
            mockedStringHelper.sanitizeToPlainText.mockReturnValue("safeString");
            mockValidateEmail.mockResolvedValue(undefined);
            mockedUserRolesService.validRoles.mockReturnValue(true);
        });

        afterAll(() => {
            jest.mocked(mockedUserPort.findByEmail).mockReset();
            mockValidateEmail.mockRestore();
            mockedUserRolesService.validRoles.mockRestore();
            mockedStringHelper.sanitizeToPlainText.mockRestore();
        });

        it("validates roles", async () => {
            const roles = ["ratata", "tralala"];
            await userCheckService.validateSanitizeUser({ email: USER_EMAIL, roles });
            expect(mockedUserRolesService.validRoles).toHaveBeenCalledWith(roles);
        });

        it.each`
            variableName
            ${"firstName"}
            ${"lastName"}
        `("if $variableName is set, call sanitizer with it", async ({ variableName }) => {
            await userCheckService.validateSanitizeUser({ email: USER_EMAIL, [variableName]: "something" });
            expect(mockedStringHelper.sanitizeToPlainText).toHaveBeenCalledWith("something");
        });
    });
});
