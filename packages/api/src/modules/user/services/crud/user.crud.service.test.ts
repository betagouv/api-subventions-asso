import userCrudService from "./user.crud.service";
import userPort from "../../../../dataProviders/db/user/user.port";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { SIGNED_TOKEN, USER_DBO, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import bcrypt from "bcrypt";

jest.mock("bcrypt");
jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
import userCheckService from "../check/user.check.service";

jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userActivationService from "../activation/user.activation.service";

jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);

import userResetPort from "../../../../dataProviders/db/user/user-reset.port";

jest.mock("../../../../dataProviders/db/user/user-reset.port");
const mockedUserResetPort = jest.mocked(userResetPort);

import consumerTokenPort from "../../../../dataProviders/db/user/consumer-token.port";

jest.mock("../../../../dataProviders/db/user/consumer-token.port");
const mockedConsumerTokenPort = jest.mocked(consumerTokenPort);

import { NotificationType } from "../../../notify/@types/NotificationType";
import userAuthService from "../auth/user.auth.service";

jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import userConsumerService from "../consumer/user.consumer.service";

jest.mock("../consumer/user.consumer.service");
const mockedUserConsumerService = jest.mocked(userConsumerService);
import notifyService from "../../../notify/notify.service";
import { RoleEnum } from "../../../../@enums/Roles";
import { UserDto } from "dto";
import UserReset from "../../entities/UserReset";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import * as portHelper from "../../../../shared/helpers/PortHelper";

jest.mock("../../../../shared/helpers/PortHelper");

import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";

import userStatsService from "../stats/user.stats.service";
import configurationsService from "../../../configurations/configurations.service";

jest.mock("../../../configurations/configurations.service");
import AssociationVisitEntity from "../../../stats/entities/AssociationVisitEntity";
import statsAssociationsVisitPort from "../../../../dataProviders/db/stats/statsAssociationsVisit.port";

jest.mock("../../../../dataProviders/db/stats/statsAssociationsVisit.port");

describe("user crud service", () => {
    describe("find", () => {
        it("should call userPort.find", async () => {
            const QUERY = { _id: USER_WITHOUT_SECRET._id };
            const expected = QUERY;
            await userCrudService.find(QUERY);
            expect(mockedUserPort.find).toHaveBeenCalledWith(expected);
        });
    });

    describe("findByEmail", () => {
        it("should call userPort.findByEmail", async () => {
            await userCrudService.findByEmail(USER_EMAIL);
            expect(mockedUserPort.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
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
            agentConnectId | checkFn
            ${null}        | ${mockedUserCheckService.validateEmailAndDomain}
            ${"something"} | ${mockedUserCheckService.validateOnlyEmail}
        `("should call userCheckService.validateEmail()", async ({ agentConnectId, checkFn }) => {
            spyFindByEmail.mockResolvedValue({ ...USER_WITHOUT_SECRET, agentConnectId });
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(checkFn).toHaveBeenCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should call userPort.update", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(mockedUserPort.update).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });
    });

    describe("delete", () => {
        let mockGetUserById: jest.SpyInstance;

        beforeAll(() => {
            mockGetUserById = jest.spyOn(userCrudService, "getUserById");
            mockGetUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserPort.delete.mockResolvedValue(true);
            mockedUserResetPort.removeAllByUserId.mockResolvedValue(true);
            mockedConsumerTokenPort.deleteAllByUserId.mockResolvedValue(true);
        });

        afterAll(() => {
            mockGetUserById.mockReset();
            mockedUserPort.delete.mockReset();
            mockedUserResetPort.removeAllByUserId.mockReset();
            mockedConsumerTokenPort.deleteAllByUserId.mockReset();
        });

        it("gets user", async () => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(mockGetUserById).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("returns false if no user without calling other ports", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
            expect(mockedUserPort.delete).not.toHaveBeenCalled();
            expect(mockedUserResetPort.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenPort.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                   | methodName                                 | arg
            ${mockedUserPort.delete}                 | ${"mockedUserPort.delete"}                 | ${USER_WITHOUT_SECRET}
            ${mockedUserResetPort.removeAllByUserId} | ${"mockedUserResetPort.removeAllByUserId"} | ${USER_WITHOUT_SECRET._id}
            ${consumerTokenPort.deleteAllByUserId}   | ${"consumerTokenPort.deleteAllByUserId"}   | ${USER_WITHOUT_SECRET._id}
        `("calls $methodName", async ({ arg, method }) => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(method).toHaveBeenCalledWith(arg);
        });

        it("returns false without other calls if mockedUserPort.delete returns false", async () => {
            mockedUserPort.delete.mockResolvedValueOnce(false);

            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);

            expect(mockedUserResetPort.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenPort.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                   | methodName
            ${mockedUserResetPort.removeAllByUserId} | ${"mockedUserResetPort.removeAllByUserId"}
            ${consumerTokenPort.deleteAllByUserId}   | ${"consumerTokenPort.deleteAllByUserId"}
        `("returns false if $methodName returns false", async ({ method }) => {
            method.mockResolvedValueOnce(false);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
        });

        it("returns true in case of success", async () => {
            const expected = true;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
        });
    });

    describe("createUser", () => {
        const FUTURE_USER = {
            firstName: "Jocelyne",
            lastName: "Dupontel",
            email: USER_EMAIL,
            roles: [RoleEnum.user],
        };

        let mockCreateUser: jest.SpyInstance;

        beforeAll(() => {
            mockCreateUser = jest.spyOn(userCrudService, "createUser");
            jest.mocked(mockedUserPort.create).mockResolvedValue(USER_WITHOUT_SECRET);
            jest.mocked(mockedUserPort.createAndReturnWithJWT).mockResolvedValue({
                ...USER_WITHOUT_SECRET,
                jwt: USER_DBO.jwt,
            });
            // @ts-expect-error - mock
            jest.mocked(bcrypt.hash).mockResolvedValue("hashedPassword");
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            mockedUserAuthService.buildJWTToken.mockReturnValue(SIGNED_TOKEN);
        });

        afterAll(() => {
            jest.mocked(mockedUserPort.findByEmail).mockReset();
            mockedUserCheckService.validateSanitizeUser.mockReset();
            jest.mocked(bcrypt.hash).mockReset();
        });

        it("sets default role", async () => {
            await userCrudService.createUser({ email: USER_EMAIL });
            expect(mockedUserCheckService.validateSanitizeUser).toHaveBeenCalledWith({
                email: USER_EMAIL,
                roles: [RoleEnum.user],
            });
        });

        it("validates user object", async () => {
            await userCrudService.createUser(FUTURE_USER);
            expect(mockedUserCheckService.validateSanitizeUser).toHaveBeenCalledWith(FUTURE_USER);
        });

        it("calls userPort.create()", async () => {
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            await userCrudService.createUser({ ...FUTURE_USER });
            expect(mockedUserPort.create).toHaveBeenCalledTimes(1);
        });

        it("ignores properties that should not be saved", async () => {
            // @ts-expect-error testing purposes
            await userCrudService.createUser({ ...FUTURE_USER, randomProperty: "lalala" });
            const expected = FUTURE_USER;
            const actual = jest.mocked(mockedUserPort.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });

        it("sets profileToComplete and active according to saved agentConnectId", async () => {
            await userCrudService.createUser({ ...FUTURE_USER, agentConnectId: "something" });
            const expected = {
                agentConnectId: "something",
                profileToComplete: false,
                active: true,
            };
            const actual = jest.mocked(mockedUserPort.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });

        it("calls alternate port if jwt needed", async () => {
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            await userCrudService.createUser({ ...FUTURE_USER }, true);
            expect(mockedUserPort.createAndReturnWithJWT).toHaveBeenCalledTimes(1);
            expect(mockedUserPort.create).not.toHaveBeenCalled();
        });
    });

    describe("signup", () => {
        let mockCreateUser: jest.SpyInstance;
        beforeAll(() => {
            mockCreateUser = jest.spyOn(userCrudService, "createUser").mockResolvedValue(USER_WITHOUT_SECRET);
        });

        afterAll(() => mockCreateUser.mockRestore());

        it("should create a consumer", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockedUserConsumerService.createConsumer.mockImplementationOnce(async () => ({} as UserDto));
            await userCrudService.signup({ email: USER_EMAIL }, RoleEnum.consumer);
            expect(mockedUserConsumerService.createConsumer).toHaveBeenCalled();
        });

        it("should create a user", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => ({} as UserDto));
            await userCrudService.signup({ email: USER_EMAIL });
            expect(mockCreateUser).toHaveBeenCalled();
        });

        it("should create a reset token", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => ({} as UserDto));
            await userCrudService.signup({ email: USER_EMAIL });
            expect(mockedUserActivationService.resetUser).toHaveBeenCalled();
        });

        it("should notify USER_CREATED", async () => {
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => ({} as UserDto));
            await userCrudService.signup({ email: USER_EMAIL });
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CREATED,
                expect.objectContaining({ email: USER_EMAIL }),
            );
        });

        it("should return a user", async () => {
            const expected = { email: USER_EMAIL };
            mockedUserActivationService.resetUser.mockImplementationOnce(async () => ({} as UserReset));
            mockCreateUser.mockImplementationOnce(async () => expected as UserDto);
            const actual = await userCrudService.signup({ email: USER_EMAIL });
            expect(actual).toEqual(expected);
        });

        it("notifies if user already exists USER_CONFLICT", async () => {
            mockCreateUser.mockRejectedValueOnce(new DuplicateIndexError("", USER_EMAIL));
            const test = () => userCrudService.signup({ email: USER_EMAIL });
            await expect(test).rejects.toThrowErrorMatchingInlineSnapshot(`"An error has occurred"`);
        });

        it("generalizes error if user already exists", async () => {
            mockCreateUser.mockRejectedValueOnce(new DuplicateIndexError("", USER_EMAIL));
            await userCrudService.signup({ email: USER_EMAIL }).catch(() => {});
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(
                NotificationType.USER_CONFLICT,
                expect.objectContaining({ email: USER_EMAIL }),
            );
        });
    });

    describe("getUserWithoutSecret", () => {
        const EMAIL = "user@mail.fr";

        it("gets user from port", async () => {
            jest.mocked(userPort.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            await userCrudService.getUserWithoutSecret(EMAIL);
            expect(userPort.getUserWithSecretsByEmail).toHaveBeenCalledWith(EMAIL);
        });

        it("should call removeSecrets()", async () => {
            jest.mocked(userPort.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            const actual = await userCrudService.getUserWithoutSecret(EMAIL);
            expect(portHelper.removeSecrets).toHaveBeenCalledTimes(1);
        });

        it("throws not found if noe found", async () => {
            jest.mocked(userPort.getUserWithSecretsByEmail).mockResolvedValueOnce(null);
            const test = () => userCrudService.getUserWithoutSecret(EMAIL);
            await expect(test).rejects.toMatchInlineSnapshot(`[Error: User not found]`);
        });
    });

    describe("updateNbRequests", () => {
        const SINCE = new Date("2022-01-16");
        const UNTIL = new Date("2024-09-09");
        let updateByDateSpy;

        beforeAll(() => {
            // @ts-expect-error -- private method
            updateByDateSpy = jest.spyOn(userStatsService, "updateNbRequestsByDate").mockResolvedValue(null);
            jest.useFakeTimers().setSystemTime(UNTIL);
            jest.mocked(configurationsService.getLastUserStatsUpdate).mockResolvedValue(SINCE);
        });

        afterAll(() => {
            updateByDateSpy.mockRestore();
            jest.useRealTimers();
            jest.mocked(configurationsService.getLastUserStatsUpdate).mockRestore();
        });

        it("calls updateNbRequestsByDate", async () => {
            await userStatsService.updateNbRequests();
            expect(updateByDateSpy).toHaveBeenCalledWith(SINCE, UNTIL);
        });
    });

    describe("updateNbRequestsByDate", () => {
        const SINCE = new Date("2022-01-16");
        const UNTIL = new Date("2024-09-09");
        const REPO_GROUP = [
            { _id: 1, associationVisits: [1] },
            { _id: 2, associationVisits: [2, 2] },
        ] as unknown as {
            _id: string;
            associationVisits: AssociationVisitEntity[];
        }[];
        const COUNTS = [
            { _id: 1, count: 1 },
            { _id: 2, count: 2 },
        ];

        beforeAll(() => {
            jest.mocked(statsAssociationsVisitPort.findGroupedByUserIdentifierOnPeriod).mockResolvedValue(REPO_GROUP);
        });

        afterAll(() => {
            jest.mocked(statsAssociationsVisitPort.findGroupedByUserIdentifierOnPeriod).mockRestore();
        });

        it("gets visits grouped by identifier ", async () => {
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(statsAssociationsVisitPort.findGroupedByUserIdentifierOnPeriod).toHaveBeenCalledWith(SINCE, UNTIL);
        });

        it("calls port for user update", async () => {
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(userPort.updateNbRequests).toHaveBeenCalledWith(COUNTS);
        });

        it("sets last user stat update in configuration", async () => {
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(configurationsService.setLastUserStatsUpdate).toHaveBeenCalledWith(UNTIL);
        });

        it("don't save last stat update in case update fails", async () => {
            jest.mocked(userPort.updateNbRequests).mockRejectedValueOnce("tata");
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL).catch(() => {});
            expect(configurationsService.setLastUserStatsUpdate).not.toHaveBeenCalled();
        });
    });
});
