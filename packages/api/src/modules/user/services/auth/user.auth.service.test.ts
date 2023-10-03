const jwtVerifyMock = jest.fn();
const jwtSignMock = jest.fn(() => SIGNED_TOKEN);
jest.mock("jsonwebtoken", () => ({
    __esModule: true, // this property makes it work
    default: {
        verify: jwtVerifyMock,
        sign: jwtSignMock,
    },
}));

import userAuthService from "./user.auth.service";
import { UserDto, UserErrorCodes } from "dto";
import { ObjectId } from "mongodb";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";
import bcrypt from "bcrypt";
jest.mock("bcrypt");
import jwt from "jsonwebtoken";

import userRepository from "../../repositories/user.repository";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import { SIGNED_TOKEN, USER_DBO, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { BadRequestError } from "../../../../shared/errors/httpErrors";
jest.mock("../../repositories/user.repository");

import userCheckService, { UserCheckService } from "../check/user.check.service";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);

describe("user auth service", () => {
    const USER_ID = new ObjectId();
    const PASSWORD = "PAssWoRD135!&";

    describe("getHashPassword", () => {
        it("should call bcrypt.hash", async () => {
            await userAuthService.getHashPassword(PASSWORD);
            expect(bcrypt.hash).toHaveBeenCalledWith(PASSWORD, 10);
        });
    });

    describe("findJwtByUser", () => {
        it("should call userRepository", async () => {
            await userAuthService.findJwtByUser({ _id: USER_ID } as UserDto);
            expect(userRepository.getUserWithSecretsById).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe("buildJWTToken", () => {
        it("should set expiresIn", () => {
            const expected = {
                expiresIn: JWT_EXPIRES_TIME,
            };
            userAuthService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: true });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: expect.any(Date) },
                expect.any(String),
                expected,
            );
        });

        it("should not set expiresIn", () => {
            const expected = {};
            userAuthService.buildJWTToken(USER_WITHOUT_SECRET, { expiration: false });
            expect(jwt.sign).toHaveBeenCalledWith(
                { ...USER_WITHOUT_SECRET, now: expect.any(Date) },
                expect.any(String),
                expected,
            );
        });
    });

    describe("updatePassword", () => {
        // @ts
        // console.log(userAuthService);
        const PASSWORD = "12345&#Data";
        const mockGetHashPassword = jest.spyOn(userAuthService, "getHashPassword");

        beforeAll(() => mockGetHashPassword.mockImplementation(async PASSWORD => PASSWORD));
        afterAll(() => mockGetHashPassword.mockRestore());

        it("should reject because password not valid", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValue(false);
            expect(userAuthService.updatePassword(USER_WITHOUT_SECRET, PASSWORD)).rejects.toEqual(
                new BadRequestError(UserCheckService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD),
            );
        });

        it("should update user", async () => {
            mockedUserCheckService.passwordValidator.mockReturnValue(true);
            await userAuthService.updatePassword(USER_WITHOUT_SECRET, PASSWORD);
            expect(userRepository.update).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                hashPassword: PASSWORD,
            });
        });
    });

    describe("updateJwt", () => {
        const mockBuildJWTToken = jest.spyOn(userAuthService, "buildJWTToken");

        it("should generate new token and update user", async () => {
            mockedUserRepository.update.mockResolvedValueOnce(JSON.parse(JSON.stringify(USER_DBO)));
            // minus two days
            const oldDate = new Date(Date.now() - 172800001);
            jwtVerifyMock.mockImplementation(() => ({
                token: "TOKEN",
                now: oldDate,
            }));
            await userAuthService.updateJwt(USER_DBO);
            expect(mockBuildJWTToken).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should return user", async () => {
            // @ts-expect-error test mock
            mockedUserRepository.update.mockResolvedValueOnce("USER WITH JWT");
            const expected = "USER WITH JWT";
            const actual = await userAuthService.updateJwt(USER_DBO);
            expect(actual).toEqual(expected);
        });
    });

    describe("logout", () => {
        beforeAll(() =>
            mockedUserRepository.getUserWithSecretsByEmail.mockImplementation(async () => ({
                ...USER_WITHOUT_SECRET,
                jwt: { token: "", expirateDate: new Date() },
                hashPassword: "",
            })),
        );

        afterAll(() => mockedUserRepository.getUserWithSecretsByEmail.mockReset());

        it("should call userRepository.getUserWithSecretsByEmail()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.getUserWithSecretsByEmail).toHaveBeenCalledTimes(1);
        });

        it("should call userRepository.update()", async () => {
            await userAuthService.logout(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
        });
    });
});
