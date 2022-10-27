import consumerTokenRepository from "./repositories/consumer-token.repository";
import userService, { UserServiceError } from "./user.service";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { JWT_SECRET } from "../../configurations/jwt.conf";
import { RoleEnum } from "../../@enums/Roles";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { UserDtoSuccessResponse } from "@api-subventions-asso/dto";
import mailNotifierService from "../mail-notifier/mail-notifier.service";
import UserReset from "./entities/UserReset";

describe("User Service", () => {
    const sendCreationMailMock = jest.spyOn(mailNotifierService, "sendCreationMail").mockImplementationOnce(jest.fn());
    const resetUserMock = jest.spyOn(userService, "resetUser");
    const createUserMock = jest.spyOn(userService, "createUser");
    const createConsumerMock = jest.spyOn(userService, "createConsumer");


    const EMAIL = "test@datasubvention.gouv.fr";
    const USER_WITHOUT_SECRET = {
        _id: new ObjectId("635132a527c9bfb8fc7c758e"),
        email: EMAIL,
        roles: ["user"],
        signupAt: new Date(),
        active: true
    } as UserDto
    const CONSUMER_USER = { ...USER_WITHOUT_SECRET, roles: ["user", "consumer"] }
    const JWT_PAYLOAD = { user: USER_WITHOUT_SECRET, isConsumerToken: true }
    const JWT_TOKEN = jwt.sign(JWT_PAYLOAD, JWT_SECRET)

    describe("signup", () => {
        it("should create a consumer", async () => {
            resetUserMock.mockImplementationOnce(async () => ({ success: true, reset: {} as UserReset }));
            createConsumerMock.mockImplementationOnce(async () => ({ success: true, user: {} } as UserDtoSuccessResponse));
            await userService.signup(EMAIL, RoleEnum.consumer);
            expect(createConsumerMock).toHaveBeenCalled();
        });

        it("should create a user", async () => {
        });

        it("should create a reset token", async () => {
            resetUserMock.mockImplementationOnce(async () => ({ success: true, reset: {} as UserReset }));
            createUserMock.mockImplementationOnce(async () => ({ success: true, user: {} } as UserDtoSuccessResponse));
            await userService.signup(EMAIL);
            expect(resetUserMock).toHaveBeenCalled();
        });

        it("should send a mail", async () => {
            resetUserMock.mockImplementationOnce(async () => ({ success: true, reset: {} as UserReset }));
            createUserMock.mockImplementationOnce(async () => ({ success: true, user: {} } as UserDtoSuccessResponse));
            await userService.signup(EMAIL);
            expect(sendCreationMailMock).toHaveBeenCalled();
        });

        it("should return success response with email", async () => {
            const expected = { email: EMAIL, success: true }
            resetUserMock.mockImplementationOnce(async () => ({ success: true, reset: {} as UserReset }));
            createUserMock.mockImplementationOnce(async () => ({ success: true, user: {} } as UserDtoSuccessResponse));
            const actual = await userService.signup(EMAIL);
            expect(actual).toEqual(expected);
        })
    })

    describe("createConsumer", () => {
        const createMock = jest.spyOn(consumerTokenRepository, "create").mockImplementation(jest.fn());
        const signMock = jest.spyOn(jwt, "sign").mockImplementation(() => JWT_TOKEN)
        it("should call userRepository.createUser", async () => {
            createUserMock.mockImplementationOnce(jest.fn());
            await userService.createConsumer(EMAIL)
            expect(createUserMock).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            createUserMock.mockImplementationOnce(async email => ({ success: false } as UserServiceError));
            await userService.createConsumer(EMAIL)
            expect(createUserMock).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = USER_WITHOUT_SECRET;

            createUserMock.mockImplementationOnce(async () => ({ success: true, user: USER_WITHOUT_SECRET }))
            signMock.mockImplementationOnce(jest.fn());
            await userService.createConsumer(EMAIL);
            // @ts-expect-error: mock
            const actual = signMock.mock.calls[0][0].user;
            expect(actual).toEqual(expected);
        })

        it("should call consumerTokenRepository.create", async () => {
            createUserMock.mockImplementationOnce(async () => ({ success: true, user: {} as UserDto }))
            await userService.createConsumer(EMAIL);
            expect(createMock).toBeCalledTimes(1);
        });

        it("should return UserDtoSuccessResponse", async () => {
            const expected = { success: true as true, user: CONSUMER_USER };
            createUserMock.mockImplementationOnce(async () => expected)
            createMock.mockImplementationOnce(async () => true)
            const actual = await userService.createConsumer(EMAIL);
            expect(actual).toEqual(expected);
        })
    })

    describe("isRoleValid", () => {
        it("should return true", () => {
            const expected = true;
            const role = RoleEnum.consumer;
            const actual = userService.isRoleValid(role);
            expect(actual).toEqual(expected);
        })

        it("should return false", () => {
            const expected = false;
            // @ts-expect-error: test
            const actual = userService.isRoleValid("not-a-role");
            expect(actual).toEqual(expected);
        })
    });

    describe("validRoles", () => {
        it("should return true", () => {
            const roles = [RoleEnum.admin, RoleEnum.user];
            const expected = true;
            // @ts-expect-error: test private method
            const actual = userService.validRoles(roles);
            expect(actual).toEqual(expected);
        })

        it("should return false", () => {
            const roles = ["foo", RoleEnum.user];
            const expected = false;
            // @ts-expect-error: test private method
            const actual = userService.validRoles(roles);
            expect(actual).toEqual(expected);
        })
    })
})