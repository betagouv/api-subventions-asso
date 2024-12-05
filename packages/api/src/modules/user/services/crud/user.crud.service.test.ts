import userCrudService from "./user.crud.service";
import userRepository from "../../repositories/user.repository";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { SIGNED_TOKEN, USER_DBO, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import bcrypt from "bcrypt";

jest.mock("bcrypt");
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import userCheckService from "../check/user.check.service";

jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userActivationService from "../activation/user.activation.service";

jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);
import userResetRepository from "../../repositories/user-reset.repository";

jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import { NotificationType } from "../../../notify/@types/NotificationType";

jest.mock("../../repositories/consumer-token.repository");
const mockedConsumerTokenRepository = jest.mocked(consumerTokenRepository);
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
import * as repositoryHelper from "../../../../shared/helpers/RepositoryHelper";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";

jest.mock("../../../stats/repositories/statsAssociationsVisit.repository");
import statsAssociationsVisitRepository from "../../../stats/repositories/statsAssociationsVisit.repository";

jest.mock("../../../../shared/helpers/RepositoryHelper");

import userStatsService from "../stats/user.stats.service";
import configurationsService from "../../../configurations/configurations.service";
jest.mock("../../../configurations/configurations.service");
import AssociationVisitEntity from "../../../stats/entities/AssociationVisitEntity";

describe("user crud service", () => {
    describe("find", () => {
        it("should call userRepository.find", async () => {
            const QUERY = { _id: USER_WITHOUT_SECRET._id };
            const expected = QUERY;
            await userCrudService.find(QUERY);
            expect(mockedUserRepository.find).toHaveBeenCalledWith(expected);
        });
    });

    describe("findByEmail", () => {
        it("should call userRepository.findByEmail", async () => {
            await userCrudService.findByEmail(USER_EMAIL);
            expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });
    });

    describe("update", () => {
        beforeAll(() => {
            mockedUserCheckService.validateEmail.mockResolvedValue(undefined);
        });

        it("should call userCheckService.validateEmail()", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(mockedUserCheckService.validateEmail).toHaveBeenCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should call userRepository.update", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });
    });

    describe("delete", () => {
        let mockGetUserById: jest.SpyInstance;

        beforeAll(() => {
            mockGetUserById = jest.spyOn(userCrudService, "getUserById");
            mockGetUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserRepository.delete.mockResolvedValue(true);
            mockedUserResetRepository.removeAllByUserId.mockResolvedValue(true);
            mockedConsumerTokenRepository.deleteAllByUserId.mockResolvedValue(true);
        });

        afterAll(() => {
            mockGetUserById.mockReset();
            mockedUserRepository.delete.mockReset();
            mockedUserResetRepository.removeAllByUserId.mockReset();
            mockedConsumerTokenRepository.deleteAllByUserId.mockReset();
        });

        it("gets user", async () => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(mockGetUserById).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("returns false if no user without calling other repos", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
            expect(mockedUserRepository.delete).not.toHaveBeenCalled();
            expect(mockedUserResetRepository.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenRepository.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                         | methodName                                       | arg
            ${mockedUserRepository.delete}                 | ${"mockedUserRepository.delete"}                 | ${USER_WITHOUT_SECRET}
            ${mockedUserResetRepository.removeAllByUserId} | ${"mockedUserResetRepository.removeAllByUserId"} | ${USER_WITHOUT_SECRET._id}
            ${consumerTokenRepository.deleteAllByUserId}   | ${"consumerTokenRepository.deleteAllByUserId"}   | ${USER_WITHOUT_SECRET._id}
        `("calls $methodName", async ({ arg, method }) => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(method).toHaveBeenCalledWith(arg);
        });

        it("returns false without other calls if mockedUserRepository.delete returns false", async () => {
            mockedUserRepository.delete.mockResolvedValueOnce(false);

            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);

            expect(mockedUserResetRepository.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenRepository.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                         | methodName
            ${mockedUserResetRepository.removeAllByUserId} | ${"mockedUserResetRepository.removeAllByUserId"}
            ${consumerTokenRepository.deleteAllByUserId}   | ${"consumerTokenRepository.deleteAllByUserId"}
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
            jest.mocked(mockedUserRepository.create).mockResolvedValue(USER_WITHOUT_SECRET);
            jest.mocked(mockedUserRepository.createAndReturnWithJWT).mockResolvedValue({
                ...USER_WITHOUT_SECRET,
                jwt: USER_DBO.jwt,
            });
            // @ts-expect-error - mock
            jest.mocked(bcrypt.hash).mockResolvedValue("hashedPassword");
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            mockedUserAuthService.buildJWTToken.mockReturnValue(SIGNED_TOKEN);
        });

        afterAll(() => {
            jest.mocked(mockedUserRepository.findByEmail).mockReset();
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

        it("calls userRepository.create()", async () => {
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            await userCrudService.createUser({ ...FUTURE_USER });
            expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
        });

        it("ignores properties that should not be saved", async () => {
            // @ts-expect-error testing purposes
            await userCrudService.createUser({ ...FUTURE_USER, randomProperty: "lalala" });
            const expected = FUTURE_USER;
            const actual = jest.mocked(mockedUserRepository.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });

        it("sets profileToComplete and active according to saved agentConnectId", async () => {
            await userCrudService.createUser({ ...FUTURE_USER, agentConnectId: "something" });
            const expected = {
                agentConnectId: "something",
                profileToComplete: false,
                active: true,
            };
            const actual = jest.mocked(mockedUserRepository.create).mock.calls[0][0];
            expect(actual).toMatchObject(expected);
        });

        it("calls alternate repo if jwt needed", async () => {
            mockedUserCheckService.validateSanitizeUser.mockImplementation(async user => user);
            await userCrudService.createUser({ ...FUTURE_USER }, true);
            expect(mockedUserRepository.createAndReturnWithJWT).toHaveBeenCalledTimes(1);
            expect(mockedUserRepository.create).not.toHaveBeenCalled();
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

        it("gets user from repo", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            await userCrudService.getUserWithoutSecret(EMAIL);
            expect(userRepository.getUserWithSecretsByEmail).toHaveBeenCalledWith(EMAIL);
        });

        it("should call removeSecrets()", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(USER_DBO);
            const actual = await userCrudService.getUserWithoutSecret(EMAIL);
            expect(repositoryHelper.removeSecrets).toHaveBeenCalledTimes(1);
        });

        it("throws not found if noe found", async () => {
            jest.mocked(userRepository.getUserWithSecretsByEmail).mockResolvedValueOnce(null);
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
            jest.mocked(statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod).mockResolvedValue(
                REPO_GROUP,
            );
        });

        afterAll(() => {
            jest.mocked(statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod).mockRestore();
        });

        it("gets visits grouped by identifier ", async () => {
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(statsAssociationsVisitRepository.findGroupedByUserIdentifierOnPeriod).toHaveBeenCalledWith(
                SINCE,
                UNTIL,
            );
        });

        it("calls repository for user update", async () => {
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(userRepository.updateNbRequests).toHaveBeenCalledWith(COUNTS);
        });

        it("sets last user stat update in configuration", async () => {
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(configurationsService.setLastUserStatsUpdate).toHaveBeenCalledWith(UNTIL);
        });

        it("don't save last stat update in case update fails", async () => {
            jest.mocked(userRepository.updateNbRequests).mockRejectedValueOnce("tata");
            // @ts-expect-error -- private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL).catch(() => {});
            expect(configurationsService.setLastUserStatsUpdate).not.toHaveBeenCalled();
        });
    });
});
