import scdlDespositCronService from "./scdl-deposit.cron.service";
import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import { DEPOSIT_LOG_ENTITY } from "./__fixtures__/depositLog.fixture";
import { USER_WITHOUT_SECRET } from "../user/__fixtures__/user.fixture";
import notifyService from "../notify/notify.service";
import { NotificationType } from "../notify/@types/NotificationType";
import userCrudService from "../user/services/crud/user.crud.service";
import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import * as DateHelper from "../../shared/helpers/DateHelper";

jest.mock("../../shared/helpers/DateHelper");
jest.mock("../user/services/crud/user.crud.service");
jest.mock("../../dataProviders/db/deposit-log/depositLog.port");
jest.mock("../notify/notify.service", () => ({
    notify: jest.fn().mockResolvedValue(true),
}));

describe("ScdlDepositCronService", () => {
    const USERS: UserDto[] = [
        USER_WITHOUT_SECRET,
        { ...USER_WITHOUT_SECRET, _id: new ObjectId("68ef9ce359f22baf00b81f71"), email: "another@email" },
    ];
    const DEPOSIT_LOGS = [DEPOSIT_LOG_ENTITY, { ...DEPOSIT_LOG_ENTITY, userId: USERS[1]._id.toString() }];

    describe("getUsersEmailToNotify", () => {
        const TWO_DAYS_AGO = new Date("2025-10-13T00:00:00.000Z");
        let mockFindByDate: jest.SpyInstance;
        let mockFindUsersByIdList: jest.SpyInstance;

        beforeEach(() => {
            mockFindByDate = jest.spyOn(depositLogPort, "findAllFromFullDay").mockResolvedValue(DEPOSIT_LOGS);
            mockFindUsersByIdList = jest.spyOn(userCrudService, "findUsersByIdList").mockResolvedValue(USERS);
            jest.mocked(DateHelper.addDaysToDate).mockReturnValue(TWO_DAYS_AGO);
        });

        it("calls findByDate", async () => {
            await scdlDespositCronService.getUsersEmailToNotify();
            expect(mockFindByDate).toHaveBeenCalledWith(TWO_DAYS_AGO);
        });

        it("retrieves users", async () => {
            await scdlDespositCronService.getUsersEmailToNotify();
            expect(mockFindUsersByIdList).toHaveBeenCalledWith([DEPOSIT_LOGS[0].userId, DEPOSIT_LOGS[1].userId]);
        });

        it("returns entities", async () => {
            const actual = await scdlDespositCronService.getUsersEmailToNotify();
            const expected = USERS.map(user => user.email); // cf mock
            expect(actual).toEqual(expected);
        });
    });

    describe("notifyTeam", () => {
        let mockGetUsersToMail: jest.SpyInstance;

        beforeEach(() => {
            mockGetUsersToMail = jest.spyOn(scdlDespositCronService, "getUsersToMail").mockResolvedValue(USERS);
        });

        afterAll(() => {
            mockGetUsersToMail.mockRestore();
        });

        it("gets users to mail", async () => {
            await scdlDespositCronService.notifyTeam();
            expect(mockGetUsersToMail).toHaveBeenCalledTimes(1);
        });

        it("return undefined if no users found ", async () => {
            mockGetUsersToMail.mockResolvedValueOnce(null);
            const expected = undefined;
            const actual = await scdlDespositCronService.notifyTeam();
            expect(actual).toEqual(expected);
        });

        it("notify DEPOSIT_UNFINISHED", async () => {
            await scdlDespositCronService.notifyTeam();
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.DEPOSIT_UNFINISHED, {
                users: USERS.map(user => ({ email: user.email, firstname: user.firstName, lastname: user.lastName })),
            });
        });
    });

    describe("getUsersToMail", () => {
        const ID_LIST = DEPOSIT_LOGS.map(deposit => deposit.userId);
        let mockGetDepositsUserIdFromDate: jest.SpyInstance;
        const SEVEN_DAYS_AGO = new Date("2025-10-01T00:00:00.000Z");

        beforeEach(() => {
            jest.mocked(DateHelper.addDaysToDate).mockReturnValue(SEVEN_DAYS_AGO);
            mockGetDepositsUserIdFromDate = jest
                .spyOn(scdlDespositCronService, "getDepositsUserIdFromDate")
                .mockResolvedValue(ID_LIST);
            jest.mocked(userCrudService.findUsersByIdList).mockResolvedValue(USERS);
        });

        afterAll(() => {
            mockGetDepositsUserIdFromDate.mockRestore();
        });

        it("returns null if no user id found", async () => {
            const expected = null;
            mockGetDepositsUserIdFromDate.mockResolvedValueOnce(null);
            const actual = await scdlDespositCronService.getUsersToMail();
            expect(actual).toEqual(expected);
        });

        it("gets deposits from period", async () => {
            await scdlDespositCronService.getUsersToMail();
            expect(mockGetDepositsUserIdFromDate).toHaveBeenCalledWith(SEVEN_DAYS_AGO);
            jest.useRealTimers();
        });

        it("gets users from id list", async () => {
            await scdlDespositCronService.getUsersToMail();
            expect(userCrudService.findUsersByIdList).toHaveBeenCalledWith(ID_LIST);
        });

        it("returns users", async () => {
            const expected = USERS;
            const actual = await scdlDespositCronService.getUsersToMail();
            expect(actual).toEqual(expected);
        });
    });

    describe("getDepositsUserIdFromDate", () => {
        const DATE = new Date();
        const mockFindAllFromFullDay = jest.spyOn(depositLogPort, "findAllFromFullDay");
        beforeEach(() => {
            mockFindAllFromFullDay.mockResolvedValue(DEPOSIT_LOGS);
        });

        it("gets deposits", async () => {
            await scdlDespositCronService.getDepositsUserIdFromDate(DATE);
            expect(depositLogPort.findAllFromFullDay).toHaveBeenCalledWith(DATE);
        });
        it("return null if no deposit on date", async () => {
            mockFindAllFromFullDay.mockResolvedValueOnce(null);
            const expected = null;
            const actual = await scdlDespositCronService.getDepositsUserIdFromDate(DATE);
            expect(actual).toEqual(expected);
        });

        it("returns deposits user id", async () => {
            const expected = DEPOSIT_LOGS.map(deposit => deposit.userId);
            const actual = await scdlDespositCronService.getDepositsUserIdFromDate(DATE);
            expect(actual).toEqual(expected);
        });
    });

    describe("notifyUsers", () => {
        let mockGetUsersToNotify: jest.SpyInstance;

        beforeEach(() => {
            mockGetUsersToNotify = jest
                .spyOn(scdlDespositCronService, "getUsersEmailToNotify")
                .mockResolvedValue(USERS.map(user => user.email));
        });

        afterAll(() => {
            mockGetUsersToNotify.mockRestore();
        });

        it("gets users to notify", async () => {
            await scdlDespositCronService.notifyUsers();
            expect(mockGetUsersToNotify).toHaveBeenCalledTimes(1);
        });

        it.skip("notify all users", async () => {
            await scdlDespositCronService.notifyUsers();
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.BATCH_DEPOSIT_RESUME, {
                emails: [USERS[0].email, USERS[1].email],
            });
        });
    });
});
