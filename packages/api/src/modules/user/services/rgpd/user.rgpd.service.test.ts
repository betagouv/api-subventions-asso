import userRgpdService from "./user.rgpd.service";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
jest.mock("../../repositories/consumer-token.repository");
const mockedConsumerTokenRepository = jest.mocked(consumerTokenRepository);
import statsService from "../../../stats/stats.service";
jest.mock("../../../stats/stats.service");
const mockedStatsService = jest.mocked(statsService);
import userCrudService from "../crud/user.crud.service";
jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import { ANONYMIZED_USER, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { NotFoundError } from "../../../../shared/errors/httpErrors";
import { ObjectId } from "mongodb";
import userResetRepository from "../../repositories/user-reset.repository";
jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
import userRepository from "../../repositories/user.repository";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import notifyService from "../../../notify/notify.service";
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import * as repositoryHelper from "../../../../shared/helpers/RepositoryHelper";
import { NotificationType } from "../../../notify/@types/NotificationType";
jest.mock("../../../../shared/helpers/RepositoryHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));

describe("user rgpd service", () => {
    describe("getAllData", () => {
        beforeEach(() => {
            mockedUserCrudService.getUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserResetRepository.findByUserId.mockResolvedValue([]);
            mockedConsumerTokenRepository.find.mockResolvedValue([]);
            mockedStatsService.getAllVisitsUser.mockResolvedValue([]);
            mockedStatsService.getAllLogUser.mockResolvedValue([]);
        });

        afterAll(() => {
            mockedConsumerTokenRepository.find.mockReset();
            mockedStatsService.getAllVisitsUser.mockReset();
            mockedStatsService.getAllLogUser.mockReset();
        });

        it("should call userService.getUserById()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedUserCrudService.getUserById).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should throw error when user not found", async () => {
            mockedUserCrudService.getUserById.mockResolvedValueOnce(null);
            const method = () => userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(method).rejects.toThrowError(NotFoundError);
        });

        it("should call userResetRepository.findByUserId()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedUserResetRepository.findByUserId).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should call consumerTokenRepository.find()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedConsumerTokenRepository.find).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should call uniformizeId()", async () => {
            const USER_ID = new ObjectId();
            const _ID = new ObjectId();

            mockedUserResetRepository.findByUserId.mockResolvedValueOnce([
                // @ts-expect-error: mock return value
                {
                    userId: USER_ID,
                    _id: _ID,
                },
            ]);

            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(repositoryHelper.uniformizeId).toHaveBeenCalledTimes(1);
        });

        it("should call statsService.getAllVisitsUser()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedStatsService.getAllVisitsUser).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should return associationVisits", async () => {
            const ASSOCIATION_VISITS = [{ userId: USER_WITHOUT_SECRET._id }];
            const expected = ASSOCIATION_VISITS.map(visit => ({ ...visit, userId: visit.userId.toString() }));
            // @ts-expect-error
            mockedStatsService.getAllVisitsUser.mockResolvedValueOnce(ASSOCIATION_VISITS);
            const actual = (await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString())).statistics
                .associationVisit;
            expect(actual).toEqual(expected);
        });

        it("should call statsService.getAllLogUser()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedStatsService.getAllLogUser).toBeCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should getting return logs", async () => {
            const expected = [{ _id: new ObjectId(), userId: new ObjectId() }];
            mockedStatsService.getAllLogUser.mockResolvedValueOnce(expected);
            const actual = (await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString())).logs;
            expect(actual).toEqual(expected);
        });
    });

    describe("disable", () => {
        const USER = USER_WITHOUT_SECRET;

        afterEach(() => {
            mockedUserRepository.update.mockReset();
        });

        it("should return false if no user", async () => {
            const expected = false;
            const actual = await userRgpdService.disable(null);
            expect(actual).toEqual(expected);
        });

        it("should call update", async () => {
            await userRgpdService.disable(USER);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(ANONYMIZED_USER);
        });

        it("should return true if update succeed", async () => {
            mockedUserRepository.update.mockResolvedValueOnce(ANONYMIZED_USER);
            const expected = true;
            const actual = await userRgpdService.disable(USER);
            expect(actual).toEqual(expected);
        });

        it("should call notify USER_DELETED", async () => {
            await userRgpdService.disable(USER);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_DELETED, {
                email: USER_WITHOUT_SECRET.email,
                selfDeleted: true,
            });
        });

        it("should call notify USER_DELETED with selfDeleted false", async () => {
            await userRgpdService.disable(USER, false);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_DELETED, {
                email: USER_WITHOUT_SECRET.email,
                selfDeleted: false,
            });
        });

        it("does not notify USER_DELETED if whileBatch", async () => {
            await userRgpdService.disable(USER, false, true);
            expect(mockedNotifyService.notify).not.toHaveBeenCalled();
        });
    });

    describe("disableById", () => {
        const USER_ID = USER_WITHOUT_SECRET._id.toString();
        let disableMock: jest.SpyInstance;

        beforeEach(() => {
            mockedUserCrudService.getUserById.mockResolvedValueOnce(USER_WITHOUT_SECRET);
            disableMock = jest.spyOn(userRgpdService, "disable").mockResolvedValue(true);
        });

        afterEach(() => {
            mockedUserCrudService.getUserById.mockReset();
            disableMock.mockRestore();
        });

        it("should fetch user from db", async () => {
            await userRgpdService.disableById(USER_ID);
            expect(mockedUserCrudService.getUserById).toHaveBeenCalledWith(USER_ID);
        });

        it("calls disable", async () => {
            await userRgpdService.disableById(USER_ID, false);
            expect(disableMock).toHaveBeenCalledWith(USER_WITHOUT_SECRET, false);
        });

        it("return result from disable", async () => {
            const expected = "ratata";
            disableMock.mockResolvedValue(expected);
            const actual = await userRgpdService.disableById(USER_ID);
            expect(actual).toBe(expected);
        });
    });

    describe("bulkDisableInactive", () => {
        let disableMock: jest.SpyInstance;

        beforeAll(() => {
            jest.mocked(userRepository.findInactiveSince).mockResolvedValue([USER_WITHOUT_SECRET, USER_WITHOUT_SECRET]);
            disableMock = jest.spyOn(userRgpdService, "disable").mockResolvedValue(true);
        });

        afterAll(() => {
            jest.mocked(userRepository.findInactiveSince).mockReset();
            disableMock.mockReset();
        });

        it("finds users inactive since 2 years", async () => {
            jest.useFakeTimers();
            const NOW = new Date("2024-01-12");
            const THEN = new Date("2022-01-12");
            jest.setSystemTime(NOW);
            await userRgpdService.bulkDisableInactive();
            expect(userRepository.findInactiveSince).toHaveBeenCalledWith(THEN);
            jest.useRealTimers();
        });

        it("calls disable for each found user", async () => {
            await userRgpdService.bulkDisableInactive();
            expect(disableMock).toHaveBeenCalledTimes(2);
        });

        it("does not notify if no result", async () => {
            jest.mocked(userRepository.findInactiveSince).mockResolvedValueOnce([]);
            await userRgpdService.bulkDisableInactive();
            expect(notifyService.notify).not.toHaveBeenCalled();
        });

        it("notifies BATCH_USERS_DELETED", async () => {
            await userRgpdService.bulkDisableInactive();
            const actual = jest.mocked(notifyService.notify).mock.calls[0][1];
            expect(actual).toMatchSnapshot();
        });
    });
});
