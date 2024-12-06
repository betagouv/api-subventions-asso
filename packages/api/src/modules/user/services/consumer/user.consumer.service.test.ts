import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { InternalServerError } from "../../../../shared/errors/httpErrors";
import { CONSUMER_JWT_PAYLOAD, CONSUMER_USER, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import userConsumerService from "./user.consumer.service";
import userCrudService from "../crud/user.crud.service";
jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import userAuthService from "../auth/user.auth.service";
jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import consumerTokenPort from "../../../../dataProviders/db/user/consumer-token.port";
import { UserServiceErrors } from "../../user.enum";
jest.mock("../../../../dataProviders/db/user/consumer-token.port");
const mockedConsumerTokenPort = jest.mocked(consumerTokenPort);

describe("user consumer service", () => {
    describe("createConsumer", () => {
        beforeAll(() => {
            mockedUserCrudService.delete.mockImplementation(jest.fn());
            mockedUserCrudService.createUser.mockImplementation(async () => CONSUMER_USER);
        });

        afterAll(() => {
            mockedUserCrudService.delete.mockReset();
            mockedUserCrudService.createUser.mockReset();
        });

        it("should call createUser()", async () => {
            await userConsumerService.createConsumer({ email: USER_EMAIL });
            expect(mockedUserCrudService.createUser).toBeCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            mockedUserCrudService.createUser.mockRejectedValueOnce(new Error());
            await userConsumerService.createConsumer({ email: USER_EMAIL }).catch(() => {});
            expect(mockedUserCrudService.createUser).toBeCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = CONSUMER_JWT_PAYLOAD;
            mockedUserCrudService.createUser.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            await userConsumerService.createConsumer({ email: USER_EMAIL });
            expect(mockedUserAuthService.buildJWTToken).toHaveBeenCalledWith(expected, {
                expiration: false,
            });
        });

        it("should call consumerTokenPort.create", async () => {
            await userConsumerService.createConsumer({ email: USER_EMAIL });
            expect(mockedConsumerTokenPort.create).toBeCalledTimes(1);
        });

        it("should delete user if token generation failed", async () => {
            mockedConsumerTokenPort.create.mockRejectedValueOnce(new Error());
            const id = USER_WITHOUT_SECRET._id.toString();
            await userConsumerService.createConsumer({ email: USER_EMAIL }).catch(() => {});
            expect(mockedUserCrudService.delete).toHaveBeenCalledWith(id);
        });

        it("should throw if token generation failed", async () => {
            mockedConsumerTokenPort.create.mockRejectedValueOnce(new Error());
            const test = () => userConsumerService.createConsumer({ email: USER_EMAIL });
            await expect(test).rejects.toMatchObject(
                new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN),
            );
        });

        it("should return UserDtoSuccessResponse", async () => {
            const expected = CONSUMER_USER;
            mockedConsumerTokenPort.create.mockImplementationOnce(async () => true);
            const actual = await userConsumerService.createConsumer({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });
    });
});
