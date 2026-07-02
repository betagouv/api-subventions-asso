import userCrudService from "./user.crud.service";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import {
    OBJECT_NEW_USER_ENTITY,
    SIGNED_TOKEN,
    USER_ENTITY,
    USER_WITHOUT_SECRET,
} from "../../__fixtures__/user.fixture";
import bcrypt from "bcrypt";

jest.mock("bcrypt");
jest.mock("../../../../adapters/outputs/db/user/user.adapter");
const mockedUserAdapter = jest.mocked(userAdapter);
import userCheckService from "../check/user.check.service";

jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userActivationService from "../activation/user.activation.service";

jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);

import userResetAdapter from "../../../../adapters/outputs/db/user/user-reset.adapter";

jest.mock("../../../../adapters/outputs/db/user/user-reset.adapter");
const mockedUserResetAdapter = jest.mocked(userResetAdapter);

import consumerTokenAdapter from "../../../../adapters/outputs/db/user/consumer-token.adapter";

jest.mock("../../../../adapters/outputs/db/user/consumer-token.adapter");
const mockedConsumerTokenAdapter = jest.mocked(consumerTokenAdapter);

import { NotificationType } from "../../../notify/@types/NotificationType";
import userAuthService from "../auth/user.auth.service";

jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import userConsumerService from "../consumer/user.consumer.service";

jest.mock("../consumer/user.consumer.service");
const mockedUserConsumerService = jest.mocked(userConsumerService);
import notifyService from "../../../notify/notify.service";
import { RoleEnum, UserRoles } from "../../../../domain/users/@types/UserRoles";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);

import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";

jest.mock("../../../configurations/configurations.service");
import NewUserEntity from "../../../../domain/users/NewUserEntity";
jest.mock("../../../../domain/users/NewUserEntity");

import UserEntity from "../../../../domain/users/UserEntity";

import * as UserHelper from "../../user.helper";
import { USER_RESET_ENTITY } from "../../__fixtures__/user-reset.fixture";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";

describe("user crud service", () => {
    beforeEach(() => {
        jest.mocked(NewUserEntity).mockReturnValue(OBJECT_NEW_USER_ENTITY);
    });

    describe("find", () => {
        it("should call userAdapter.find", async () => {
            const QUERY = { _id: USER_WITHOUT_SECRET.id };
            const expected = QUERY;
            await userCrudService.find(QUERY);
            expect(mockedUserAdapter.find).toHaveBeenCalledWith(expected);
        });
    });

    describe("findUsersByIdList", () => {
        it("fetch users by id list", async () => {
            const ID_LIST = [""];
            await userCrudService.findUsersByIdList(ID_LIST);
            expect(mockedUserAdapter.findByIds).toHaveBeenCalledWith(ID_LIST);
        });
    });

    describe("findByEmail", () => {
        it("should call userAdapter.findByEmail", async () => {
            await userCrudService.findByEmail(USER_EMAIL);
            expect(mockedUserAdapter.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });
    });

    describe("update", () => {
        let spyFindByEmail;

        beforeAll(() => {
            spyFindByEmail = jest.spyOn(userCrudService, "findByEmail").mockResolvedValue(USER_WITHOUT_SECRET);
        });

        it("gets original user", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(spyFindByEmail).toHaveBeenCalledWith(USER_WITHOUT_SECRET.email);
        });

        it.each`
            proConnectId   | checkFn
            ${null}        | ${mockedUserCheckService.validateEmailAndDomain}
            ${"something"} | ${mockedUserCheckService.validateOnlyEmail}
        `("should call userCheckService.validateEmail()", async ({ proConnectId, checkFn }) => {
            spyFindByEmail.mockResolvedValue({ ...USER_WITHOUT_SECRET, proConnectId });
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(checkFn).toHaveBeenCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should call userAdapter.update", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(mockedUserAdapter.update).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });
    });

    describe("delete", () => {
        let mockGetUserById: jest.SpyInstance;

        beforeAll(() => {
            mockGetUserById = jest.spyOn(userCrudService, "getUserById");
            mockGetUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserAdapter.delete.mockResolvedValue(true);
            mockedUserResetAdapter.removeAllByUserId.mockResolvedValue(true);
            mockedConsumerTokenAdapter.deleteAllByUserId.mockResolvedValue(true);
        });

        afterAll(() => {
            mockGetUserById.mockReset();
            mockedUserAdapter.delete.mockReset();
            mockedUserResetAdapter.removeAllByUserId.mockReset();
            mockedConsumerTokenAdapter.deleteAllByUserId.mockReset();
        });

        it("gets user", async () => {
            await userCrudService.delete(USER_WITHOUT_SECRET.id.toString());
            expect(mockGetUserById).toHaveBeenCalledWith(USER_WITHOUT_SECRET.id.toString());
        });

        it("returns false if no user without calling other ports", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET.id.toString());
            expect(actual).toBe(expected);
            expect(mockedUserAdapter.delete).not.toHaveBeenCalled();
            expect(mockedUserResetAdapter.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenAdapter.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                      | methodName                                 | arg
            ${mockedUserAdapter.delete}                 | ${"mockedUserPort.delete"}                 | ${USER_WITHOUT_SECRET}
            ${mockedUserResetAdapter.removeAllByUserId} | ${"mockedUserResetPort.removeAllByUserId"} | ${USER_WITHOUT_SECRET.id}
            ${consumerTokenAdapter.deleteAllByUserId}   | ${"consumerTokenPort.deleteAllByUserId"}   | ${USER_WITHOUT_SECRET.id}
        `("calls $methodName", async ({ arg, method }) => {
            await userCrudService.delete(USER_WITHOUT_SECRET.id.toString());
            expect(method).toHaveBeenCalledWith(arg);
        });

        it("returns false without other calls if mockedUserPort.delete returns false", async () => {
            mockedUserAdapter.delete.mockResolvedValueOnce(false);

            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET.id.toString());
            expect(actual).toBe(expected);

            expect(mockedUserResetAdapter.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenAdapter.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                      | methodName
            ${mockedUserResetAdapter.removeAllByUserId} | ${"mockedUserResetPort.removeAllByUserId"}
            ${consumerTokenAdapter.deleteAllByUserId}   | ${"consumerTokenPort.deleteAllByUserId"}
        `("returns false if $methodName returns false", async ({ method }) => {
            method.mockResolvedValueOnce(false);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET.id.toString());
            expect(actual).toBe(expected);
        });

        it("returns true in case of success", async () => {
            const expected = true;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET.id.toString());
            expect(actual).toBe(expected);
        });
    });

    describe("createUser", () => {
        const FUTURE_USER = new NewUserEntity({
            proConnectId: "1234",
            firstName: "Jocelyne",
            lastName: "Dupontel",
            email: USER_EMAIL,
            roles: [RoleEnum.user],
        });

        const EXPIRATE_DATE = new Date("2026-06-22");

        const USER_TOKEN = {
            token: SIGNED_TOKEN,
            expirateDate: EXPIRATE_DATE,
        };

        beforeAll(() => {
            jest.spyOn(userCrudService, "createUser");
            jest.mocked(mockedUserAdapter.create).mockResolvedValue(USER_WITHOUT_SECRET);
            // @ts-expect-error - mock
            jest.mocked(bcrypt.hash).mockResolvedValue("hashedPassword");
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => ({
                ...user,
                firstName: "sanitizedFirstName",
                lastName: "sanitizedLastName",
            }));
            mockedUserAuthService.buildJWTToken.mockReturnValue(SIGNED_TOKEN);
            jest.spyOn(UserHelper, "getNewJwtExpireDate").mockReturnValue(EXPIRATE_DATE);
        });

        afterAll(() => {
            jest.mocked(mockedUserAdapter.findByEmail).mockReset();
            mockedUserCheckService.validateSanitizeUser.mockReset();
            jest.mocked(bcrypt.hash).mockReset();
        });

        it("validates user object", async () => {
            await userCrudService.createUser(FUTURE_USER);
            expect(mockedUserCheckService.validateSanitizeUser).toHaveBeenCalledWith(FUTURE_USER);
        });

        it("create a NewUserEntity with sanitized values", async () => {
            await userCrudService.createUser(FUTURE_USER);
            expect(NewUserEntity).toHaveBeenCalledWith({
                email: FUTURE_USER.email,
                roles: FUTURE_USER.roles,
                firstName: "sanitizedFirstName",
                lastName: "sanitizedLastName",
                proConnectId: FUTURE_USER.proConnectId,
            });
        });

        it("create jwt token", async () => {
            await userCrudService.createUser(FUTURE_USER);
            expect(mockedUserAuthService.buildJWTToken).toHaveBeenCalledWith(OBJECT_NEW_USER_ENTITY);
        });

        it("get token expiration date", async () => {
            await userCrudService.createUser(FUTURE_USER);
            expect(UserHelper.getNewJwtExpireDate).toHaveBeenCalled();
        });

        it("calls userAdapter.create()", async () => {
            await userCrudService.createUser(FUTURE_USER);
            expect(mockedUserAdapter.create).toHaveBeenCalledWith(
                new NewUserEntity({ ...FUTURE_USER, jwt: USER_TOKEN }),
            );
        });
    });

    describe("signup", () => {
        let mockCreateUser: jest.SpyInstance;

        beforeAll(() => {
            mockCreateUser = jest.spyOn(userCrudService, "createUser").mockResolvedValue(USER_ENTITY);
            mockedUserActivationService.resetUser.mockResolvedValue(USER_RESET_ENTITY);
        });

        afterAll(() => mockCreateUser.mockRestore());

        it("should create a consumer", async () => {
            jest.mocked(NewUserEntity).mockReturnValueOnce({
                ...OBJECT_NEW_USER_ENTITY,
                roles: [UserRoles.USER, UserRoles.CONSUMER],
            } as NewUserEntity);
            mockedUserConsumerService.createConsumer.mockResolvedValue(USER_ENTITY);

            await userCrudService.signup(
                new NewUserEntity({ ...OBJECT_NEW_USER_ENTITY, roles: [UserRoles.USER, UserRoles.CONSUMER] }),
            );
            expect(mockedUserConsumerService.createConsumer).toHaveBeenCalled();
        });

        it("should create a user", async () => {
            mockCreateUser.mockResolvedValue(USER_ENTITY);
            await userCrudService.signup(OBJECT_NEW_USER_ENTITY);
            expect(mockCreateUser).toHaveBeenCalled();
        });

        it("should create a reset token", async () => {
            mockCreateUser.mockResolvedValue(USER_ENTITY);
            await userCrudService.signup(OBJECT_NEW_USER_ENTITY);
            expect(mockedUserActivationService.resetUser).toHaveBeenCalled();
        });

        it("should notify USER_CREATED", async () => {
            mockCreateUser.mockResolvedValue(USER_ENTITY);
            await userCrudService.signup(OBJECT_NEW_USER_ENTITY);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({
                    email: OBJECT_NEW_USER_ENTITY.email,
                    firstname: OBJECT_NEW_USER_ENTITY.firstName,
                    lastname: OBJECT_NEW_USER_ENTITY.lastName,
                    url: `${FRONT_OFFICE_URL}/auth/activate/${USER_RESET_ENTITY.token}`,
                    active: USER_ENTITY.active,
                    signupAt: USER_ENTITY.signupAt,
                    isProConnect: false,
                }),
            );
        });

        it("should return a user", async () => {
            const expected = OBJECT_NEW_USER_ENTITY;
            mockCreateUser.mockImplementationOnce(async () => expected as NewUserEntity);
            const actual = await userCrudService.signup(OBJECT_NEW_USER_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("notifies if user already exists USER_CONFLICT", async () => {
            mockCreateUser.mockRejectedValueOnce(new DuplicateIndexError("", USER_EMAIL));
            const test = () => userCrudService.signup(OBJECT_NEW_USER_ENTITY);
            await expect(test).rejects.toThrowErrorMatchingInlineSnapshot(`"An error has occurred"`);
        });

        it("generalizes error if user already exists", async () => {
            mockCreateUser.mockRejectedValueOnce(new DuplicateIndexError("", USER_EMAIL));
            await userCrudService.signup(OBJECT_NEW_USER_ENTITY).catch(() => {});
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CONFLICT,
                expect.objectContaining(OBJECT_NEW_USER_ENTITY),
            );
        });
    });

    describe("listUsers", () => {
        let findSpy: jest.SpyInstance;
        const DATE = new Date("2025-01-16");
        const RESETS = [
            {
                _id: "6a34fe03b088053fece33d61",
                userId: "1",
                token: "TOKEN1",
                createdAt: DATE,
            },
            null,
            {
                _id: "6a34fe0edba7135cc014da94",
                userId: "1",
                token: "TOKEN3",
                createdAt: DATE,
            },
            {
                _id: "6a34fe1256fbb628b744ea37",
                userId: "1",
                token: "TOKEN4",
                createdAt: DATE,
            },
        ];

        beforeAll(() => {
            findSpy = jest
                .spyOn(userCrudService, "find")
                .mockResolvedValue([1, 2, 3, 4].map(i => ({ id: i }) as unknown as UserEntity));
            jest.mocked(userActivationService.buildResetPwdUrl).mockImplementation(t => `link/${t}`);
        });

        beforeEach(() => {
            jest.mocked(userResetAdapter.findOneByUserId).mockResolvedValueOnce(RESETS[0]); // return TOKEN1
            jest.mocked(userResetAdapter.findOneByUserId).mockResolvedValueOnce(RESETS[1]); // return user (2) as token is null
            jest.mocked(userResetAdapter.findOneByUserId).mockResolvedValueOnce(RESETS[2]); // return TOKEN3
            jest.mocked(userResetAdapter.findOneByUserId).mockResolvedValueOnce(RESETS[3]); // return user (4) as isResetExpired return true

            jest.mocked(userActivationService.isResetExpired).mockReturnValueOnce(false); // for user 1
            jest.mocked(userActivationService.isResetExpired).mockReturnValueOnce(false); // for user 3 as user 2 doen't have a token
            jest.mocked(userActivationService.isResetExpired).mockReturnValueOnce(true); // for user 4
        });

        it("gets users", async () => {
            await userCrudService.listUsers();
            expect(findSpy).toHaveBeenCalled();
        });

        it("gets reset token for each user", async () => {
            await userCrudService.listUsers();
            expect(userResetAdapter.findOneByUserId).toHaveBeenCalledWith(1);
            expect(userResetAdapter.findOneByUserId).toHaveBeenCalledWith(2);
            expect(userResetAdapter.findOneByUserId).toHaveBeenCalledWith(3);
            expect(userResetAdapter.findOneByUserId).toHaveBeenCalledWith(4);
        });

        it("controls expiration of each found token", async () => {
            await userCrudService.listUsers();
            expect(userActivationService.isResetExpired).toHaveBeenCalledTimes(3);
        });

        it("builds reset pwd url for each valid token", async () => {
            await userCrudService.listUsers();
            expect(userActivationService.buildResetPwdUrl).toHaveBeenCalledWith("TOKEN1");
            expect(userActivationService.buildResetPwdUrl).toHaveBeenCalledWith("TOKEN3");
        });

        it("returns proper result", async () => {
            const actual = await userCrudService.listUsers();
            expect(actual).toMatchSnapshot();
        });
    });
});
