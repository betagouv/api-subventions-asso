import userRgpdService from "./user.rgpd.service";
import consumerTokenPort from "../../../../dataProviders/db/user/consumer-token.port";
import * as Sentry from "@sentry/node";

jest.mock("@sentry/node");

jest.mock("../../../../dataProviders/db/user/consumer-token.port");
const mockedConsumerTokenPort = jest.mocked(consumerTokenPort);
import statsService from "../../../stats/stats.service";

jest.mock("../../../stats/stats.service");
const mockedStatsService = jest.mocked(statsService);
import userCrudService from "../crud/user.crud.service";

jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import { ANONYMIZED_USER, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { NotFoundError } from "core";
import { ObjectId } from "mongodb";
import userResetPort from "../../../../dataProviders/db/user/user-reset.port";

jest.mock("../../../../dataProviders/db/user/user-reset.port");
const mockedUserResetPort = jest.mocked(userResetPort);
import userPort from "../../../../dataProviders/db/user/user.port";

jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
import notifyService from "../../../notify/notify.service";

jest.mock("../../../../dataProviders/db/configurations/configurations.port");
import configurationsPort from "../../../../dataProviders/db/configurations/configurations.port";

jest.mock("../../../configurations/configurations.service");
import configurationsService from "../../../configurations/configurations.service";

jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);
import * as portHelper from "../../../../shared/helpers/PortHelper";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userActivationService from "../activation/user.activation.service";
import { STALL_RGPD_CRON_6_MONTHS_DELETION } from "../../../../configurations/mail.conf";
import { UserDto } from "dto";

jest.mock("../../../../shared/helpers/PortHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));

import logsPort from "../../../../dataProviders/db/stats/logs.port";
import { WinstonLog } from "../../../../@types/WinstonLog";
jest.mock("../../../../dataProviders/db/stats/logs.port");

describe("user rgpd service", () => {
    describe("getAllData", () => {
        beforeEach(() => {
            mockedUserCrudService.getUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserResetPort.findByUserId.mockResolvedValue([]);
            mockedConsumerTokenPort.find.mockResolvedValue([]);
            mockedStatsService.getAllVisitsUser.mockResolvedValue([]);
            mockedStatsService.getAllLogUser.mockResolvedValue([]);
        });

        afterAll(() => {
            mockedConsumerTokenPort.find.mockReset();
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

        it("should call userResetPort.findByUserId()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedUserResetPort.findByUserId).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should call consumerTokenPort.find()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedConsumerTokenPort.find).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should call uniformizeId()", async () => {
            const USER_ID = new ObjectId();
            const _ID = new ObjectId();

            mockedUserResetPort.findByUserId.mockResolvedValueOnce([
                // @ts-expect-error: mock return value
                {
                    userId: USER_ID,
                    _id: _ID,
                },
            ]);

            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(portHelper.uniformizeId).toHaveBeenCalledTimes(1);
        });

        it("should call statsService.getAllVisitsUser()", async () => {
            await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString());
            expect(mockedStatsService.getAllVisitsUser).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should return associationVisits", async () => {
            const ASSOCIATION_VISITS = [{ userId: USER_WITHOUT_SECRET._id }];
            const expected = ASSOCIATION_VISITS.map(visit => ({ ...visit, userId: visit.userId.toString() }));
            // @ts-expect-error: mock
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
            // @ts-expect-error: mock logs
            const expected = [{ _id: new ObjectId(), userId: new ObjectId() }] as WithId<WinstonLog>[];
            mockedStatsService.getAllLogUser.mockResolvedValueOnce(expected);
            const actual = (await userRgpdService.getAllData(USER_WITHOUT_SECRET._id.toString())).logs;
            expect(actual).toEqual(expected);
        });
    });

    describe("disable", () => {
        const USER = USER_WITHOUT_SECRET;

        beforeEach(() => {
            mockedUserPort.update.mockResolvedValue({} as UserDto);
        });

        afterEach(() => {
            mockedUserPort.update.mockReset();
        });

        it("should return false if no user", async () => {
            const expected = false;
            const actual = await userRgpdService.disable(null);
            expect(actual).toEqual(expected);
        });

        it("should call update", async () => {
            await userRgpdService.disable(USER);
            expect(mockedUserPort.update).toHaveBeenCalledWith(ANONYMIZED_USER);
        });

        it("should return true if update succeed", async () => {
            mockedUserPort.update.mockResolvedValueOnce(ANONYMIZED_USER);
            jest.mocked(logsPort.anonymizeLogsByUser).mockResolvedValue(true);
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

        it("should anonymize logs too", async () => {
            await userRgpdService.disable(USER);
            expect(jest.mocked(logsPort.anonymizeLogsByUser)).toHaveBeenCalledWith(USER, ANONYMIZED_USER);
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
            jest.mocked(userPort.findInactiveSince).mockResolvedValue([USER_WITHOUT_SECRET]);
            jest.mocked(userPort.findNotActivatedSince).mockResolvedValue([{ ...USER_WITHOUT_SECRET }]);
            disableMock = jest.spyOn(userRgpdService, "disable").mockResolvedValue(true);
        });

        afterAll(() => {
            jest.mocked(userPort.findInactiveSince).mockReset();
            jest.mocked(userPort.findNotActivatedSince).mockReset();
            disableMock.mockReset();
        });

        it("finds users inactive since 2 years", async () => {
            jest.useFakeTimers();
            const NOW = new Date("2024-01-12");
            const THEN = new Date("2022-01-12");
            jest.setSystemTime(NOW);
            await userRgpdService.bulkDisableInactive();
            expect(userPort.findInactiveSince).toHaveBeenCalledWith(THEN);
            jest.useRealTimers();
        });

        it("finds users never seen for 6 months", async () => {
            jest.useFakeTimers();
            const NOW = new Date("2024-01-12");
            const THEN = new Date("2023-07-12");
            jest.setSystemTime(NOW);
            await userRgpdService.bulkDisableInactive();
            expect(userPort.findNotActivatedSince).toHaveBeenCalledWith(THEN);
            jest.useRealTimers();
        });

        it("calls disable for each found user", async () => {
            await userRgpdService.bulkDisableInactive();
            expect(disableMock).toHaveBeenCalledTimes(2);
        });

        it("does not include 6 months users before STALL_RGPD_CRON_6_MONTHS_DELETION", async () => {
            jest.useFakeTimers();
            const NOW = new Date(
                STALL_RGPD_CRON_6_MONTHS_DELETION.getFullYear(),
                STALL_RGPD_CRON_6_MONTHS_DELETION.getMonth() - 1,
                STALL_RGPD_CRON_6_MONTHS_DELETION.getDate(),
            );
            jest.setSystemTime(NOW);
            await userRgpdService.bulkDisableInactive();
            expect(disableMock).toHaveBeenCalledTimes(1);
            jest.useRealTimers();
        });

        it("does not notify if no result", async () => {
            jest.mocked(userPort.findInactiveSince).mockResolvedValueOnce([]);
            jest.mocked(userPort.findNotActivatedSince).mockResolvedValueOnce([]);
            await userRgpdService.bulkDisableInactive();
            expect(notifyService.notify).not.toHaveBeenCalled();
        });

        it("notifies BATCH_USERS_DELETED", async () => {
            await userRgpdService.bulkDisableInactive();
            const actual = jest.mocked(notifyService.notify).mock.calls[0][1];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("warnDisableInactive", () => {
        let resetMock: jest.SpyInstance;
        let NOW, THEN;

        beforeAll(() => {
            jest.useFakeTimers();
            NOW = new Date("2024-01-12");
            THEN = new Date("2023-08-12");
            jest.setSystemTime(NOW);
            jest.mocked(userPort.findNotActivatedSince).mockResolvedValue([USER_WITHOUT_SECRET, USER_WITHOUT_SECRET]);
            resetMock = jest.spyOn(userActivationService, "resetUser").mockResolvedValue({
                userId: new ObjectId(),
                token: "FAKE_TOKEN",
                createdAt: new Date(),
            });
        });

        afterAll(() => {
            jest.mocked(userPort.findNotActivatedSince).mockReset();
            resetMock.mockReset();
            jest.useRealTimers();
        });

        it("finds users never seen for 5 month", async () => {
            await userRgpdService.warnDisableInactive();
            expect(userPort.findNotActivatedSince).toHaveBeenCalledWith(THEN, undefined);
        });

        it("finds users never seen for 5 month since last call", async () => {
            const DATE = new Date("2023-05-01");
            // @ts-expect-error -- partial mock
            jest.mocked(configurationsPort.getByName).mockResolvedValueOnce({ data: DATE });
            await userRgpdService.warnDisableInactive();
            expect(userPort.findNotActivatedSince).toHaveBeenCalledWith(THEN, DATE);
        });

        it("calls reset for each found user", async () => {
            await userRgpdService.warnDisableInactive();
            expect(resetMock).toHaveBeenCalledTimes(2);
        });

        it("notifies WARN_NEW_USER_TO_BE_DELETED for each success", async () => {
            await userRgpdService.warnDisableInactive();
            const actual = jest.mocked(notifyService.notify).mock.calls;
            expect(actual).toMatchSnapshot();
        });

        it("saves warning date", async () => {
            await userRgpdService.warnDisableInactive();
            expect(configurationsService.updateConfigEntity).toHaveBeenCalledWith("LAST-RGPD-WARNED-DATE", THEN);
        });

        describe("if one reset fails", () => {
            const ERROR = new Error("test");

            beforeEach(() => {
                resetMock.mockRejectedValueOnce(ERROR);
            });

            it("notify only successful resets", async () => {
                await userRgpdService.warnDisableInactive();
                expect(notifyService.notify).toHaveBeenCalledTimes(1);
            });

            it("captures exception to Sentry", async () => {
                await userRgpdService.warnDisableInactive();
                expect(Sentry.captureException).toHaveBeenCalledWith(ERROR);
            });

            it("does not fail but return false", async () => {
                const test = userRgpdService.warnDisableInactive();
                expect(test).resolves.toBe(false);
            });
        });
    });
});
