import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { InternalServerError } from "core";
import { CONSUMER_USER, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import userConsumerService from "./user.consumer.service";
import userCrudService from "../crud/user.crud.service";
jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import userAuthService from "../auth/user.auth.service";
jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import consumerTokenAdapter from "../../../../adapters/outputs/db/user/consumer-token.adapter";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
jest.mock("../../../../adapters/outputs/db/user/consumer-token.adapter");
const mockedConsumerTokenAdapter = jest.mocked(consumerTokenAdapter);

describe("user consumer service", () => {
    describe("createConsumer", () => {
        const NEW_USER = new NewUserEntity({ email: USER_EMAIL });
        beforeAll(() => {
            mockedUserCrudService.delete.mockImplementation(jest.fn());
            mockedUserCrudService.createUser.mockImplementation(async () => CONSUMER_USER);
        });

        afterAll(() => {
            mockedUserCrudService.delete.mockReset();
            mockedUserCrudService.createUser.mockReset();
        });

        it("should call createUser()", async () => {
            await userConsumerService.createConsumer(NEW_USER);
            expect(mockedUserCrudService.createUser).toHaveBeenCalledTimes(1);
        });

        it("should not create consumer token if user creation failed", async () => {
            mockedUserCrudService.createUser.mockRejectedValueOnce(new Error());
            await userConsumerService.createConsumer(NEW_USER).catch(() => {});
            expect(mockedUserCrudService.createUser).toHaveBeenCalledTimes(1);
        });

        it("should create a token ", async () => {
            const expected = USER_WITHOUT_SECRET;
            mockedUserCrudService.createUser.mockImplementationOnce(async () => USER_WITHOUT_SECRET);
            await userConsumerService.createConsumer(NEW_USER);
            expect(mockedUserAuthService.buildJWTToken).toHaveBeenCalledWith(expected, {
                expiration: false,
                isConsumerToken: true,
            });
        });

        it("should call consumerTokenAdapter.create", async () => {
            await userConsumerService.createConsumer(NEW_USER);
            expect(mockedConsumerTokenAdapter.create).toHaveBeenCalledTimes(1);
        });

        it("should delete user if token generation failed", async () => {
            mockedConsumerTokenAdapter.create.mockRejectedValueOnce(new Error());
            const id = USER_WITHOUT_SECRET.id;
            await userConsumerService.createConsumer(NEW_USER).catch(() => {});
            expect(mockedUserCrudService.delete).toHaveBeenCalledWith(id);
        });

        it("should throw if token generation failed", async () => {
            mockedConsumerTokenAdapter.create.mockRejectedValueOnce(new Error());
            const test = () => userConsumerService.createConsumer(NEW_USER);
            await expect(test).rejects.toMatchObject(new InternalServerError("Could not create consumer token"));
        });

        it("should return UserEntity", async () => {
            const expected = CONSUMER_USER;
            mockedConsumerTokenAdapter.create.mockImplementationOnce(async () => true);
            const actual = await userConsumerService.createConsumer(NEW_USER);
            expect(actual).toEqual(expected);
        });
    });
});
