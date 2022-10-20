import { UserWithoutSecret } from "./entities/User";
import consumerTokenRepository from "./repositories/consumer-token.repository";
import userService, { UserServiceError } from "./user.service";
import jwt from "jsonwebtoken";
import { ObjectId, WithId } from "mongodb";
import { JWT_SECRET } from "../../configurations/jwt.conf";

describe("User Service", () => {
    const createUserMock = jest.spyOn(userService, "createUser");


    const EMAIL = "test@datasubvention.gouv.fr";
    const USER_WITHOUT_SECRET = {
        _id: new ObjectId("635132a527c9bfb8fc7c758e"),
        email: EMAIL,
        roles: ["User"],
        signupAt: new Date(),
        active: true
    } as WithId<UserWithoutSecret>
    const JWT_PAYLOAD = { ...USER_WITHOUT_SECRET, isConsumerToken: true }
    const JWT_TOKEN = jwt.sign(JWT_PAYLOAD, JWT_SECRET)

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
            createUserMock.mockImplementationOnce(async () => ({ success: true, user: {} as UserWithoutSecret }))
            await userService.createConsumer(EMAIL);
            expect(createMock).toBeCalledTimes(1);
        });

        it("should return UserDtoSuccessResponse", async () => {
            const expected = { success: true as true, user: USER_WITHOUT_SECRET };
            createUserMock.mockImplementationOnce(async () => expected)
            createMock.mockImplementationOnce(async () => true)
            const actual = await userService.createConsumer(EMAIL);
            expect(actual).toEqual(expected);
        })
    })
})