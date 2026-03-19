import { DEPOSIT_LOG_ENTITY } from "./__fixtures__/depositLog.fixture";
import { USER_WITHOUT_SECRET } from "../user/__fixtures__/user.fixture";
import notifyService from "../notify/notify.service";
import { NotificationType } from "../notify/@types/NotificationType";
import userCrudService from "../user/services/crud/user.crud.service";
import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import * as DateHelper from "../../shared/helpers/DateHelper";
import { ScdlDepositCronService } from "./scdl-deposit.cron.service";
import { DepositLogPort } from "../../dataProviders/db/deposit-log/deposit-log.port";
import { createMockDepositLogPort } from "../../../tests/__mocks__/deposit-log/deposit-log.port.mock";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";

jest.mock("../../shared/helpers/DateHelper");
jest.mock("../user/services/crud/user.crud.service");
jest.mock("../../dataProviders/db/deposit-log/deposit-log.port");
jest.mock("../notify/notify.service", () => ({
    notify: jest.fn().mockResolvedValue(true),
}));

describe("ScdlDepositCronService", () => {
    const LAST_YEAR = new Date("2025-02-01");
    const USERS: UserDto[] = [
        USER_WITHOUT_SECRET,
        { ...USER_WITHOUT_SECRET, _id: new ObjectId("68ef9ce359f22baf00b81f71"), email: "another@email" },
    ];
    const DEPOSIT_LOGS = [DEPOSIT_LOG_ENTITY, { ...DEPOSIT_LOG_ENTITY, userId: USERS[1]._id.toString() }];
    const SAME_MONTH_LAST_YEAR_DEPOSITS: DepositScdlLogEntity[] = DEPOSIT_LOGS.map(deposit => ({
        ...deposit,
        updateDate: LAST_YEAR,
    }));
    let mockDepositLogPort: jest.Mocked<DepositLogPort>;
    let scdlDepositCronService: ScdlDepositCronService;

    beforeEach(() => {
        mockDepositLogPort = createMockDepositLogPort();
        scdlDepositCronService = new ScdlDepositCronService(mockDepositLogPort);
    });

    describe("getUsersEmailToNotify", () => {
        const TWO_DAYS_AGO = new Date("2025-10-13T00:00:00.000Z");
        let mockFindByDate: jest.SpyInstance;
        let mockFindUsersByIdList: jest.SpyInstance;

        beforeEach(() => {
            mockFindByDate = mockDepositLogPort.findAllFromFullDay.mockResolvedValue(DEPOSIT_LOGS);
            mockFindUsersByIdList = jest.spyOn(userCrudService, "findUsersByIdList").mockResolvedValue(USERS);
            jest.mocked(DateHelper.addDaysToDate).mockReturnValue(TWO_DAYS_AGO);
        });

        it("calls findByDate", async () => {
            await scdlDepositCronService.getUsersEmailToNotify();
            expect(mockFindByDate).toHaveBeenCalledWith(TWO_DAYS_AGO);
        });

        it("retrieves users", async () => {
            await scdlDepositCronService.getUsersEmailToNotify();
            expect(mockFindUsersByIdList).toHaveBeenCalledWith([DEPOSIT_LOGS[0].userId, DEPOSIT_LOGS[1].userId]);
        });

        it("returns entities", async () => {
            const actual = await scdlDepositCronService.getUsersEmailToNotify();
            const expected = USERS.map(user => user.email); // cf mock
            expect(actual).toEqual(expected);
        });
    });

    describe("notifyTeam", () => {
        let mockGetUsersToMail: jest.SpyInstance;

        beforeEach(() => {
            mockGetUsersToMail = jest.spyOn(scdlDepositCronService, "getUsersToMail").mockResolvedValue(USERS);
        });

        afterAll(() => {
            mockGetUsersToMail.mockRestore();
        });

        it("gets users to mail", async () => {
            await scdlDepositCronService.notifyTeam();
            expect(mockGetUsersToMail).toHaveBeenCalledTimes(1);
        });

        it("return undefined if no users found ", async () => {
            mockGetUsersToMail.mockResolvedValueOnce(null);
            const expected = undefined;
            const actual = await scdlDepositCronService.notifyTeam();
            expect(actual).toEqual(expected);
        });

        it("notify DEPOSIT_UNFINISHED", async () => {
            await scdlDepositCronService.notifyTeam();
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
                .spyOn(scdlDepositCronService, "getDepositsUserIdFromDate")
                .mockResolvedValue(ID_LIST);
            jest.mocked(userCrudService.findUsersByIdList).mockResolvedValue(USERS);
        });

        afterAll(() => {
            mockGetDepositsUserIdFromDate.mockRestore();
        });

        it("returns null if no user id found", async () => {
            const expected = null;
            mockGetDepositsUserIdFromDate.mockResolvedValueOnce(null);
            const actual = await scdlDepositCronService.getUsersToMail();
            expect(actual).toEqual(expected);
        });

        it("gets deposits from period", async () => {
            await scdlDepositCronService.getUsersToMail();
            expect(mockGetDepositsUserIdFromDate).toHaveBeenCalledWith(SEVEN_DAYS_AGO);
            jest.useRealTimers();
        });

        it("gets users from id list", async () => {
            await scdlDepositCronService.getUsersToMail();
            expect(userCrudService.findUsersByIdList).toHaveBeenCalledWith(ID_LIST);
        });

        it("returns users", async () => {
            const expected = USERS;
            const actual = await scdlDepositCronService.getUsersToMail();
            expect(actual).toEqual(expected);
        });
    });

    describe("getDepositsSameMonthLastYear", () => {
        const LAST_DAY_IN_MONTH = 28;
        const START = new Date(LAST_YEAR);
        const END = new Date(LAST_YEAR);
        END.setDate(LAST_DAY_IN_MONTH);

        beforeEach(() => {
            jest.spyOn(DateHelper, "sameDateLastYear").mockReturnValue(LAST_YEAR);
            jest.spyOn(DateHelper, "lastDayInMonth").mockReturnValue(LAST_DAY_IN_MONTH);
            mockDepositLogPort.findFromPeriod.mockResolvedValue(SAME_MONTH_LAST_YEAR_DEPOSITS);
        });

        it("defines same month last year date", async () => {
            await scdlDepositCronService.getDepositsSameMonthLastYear();
            expect(DateHelper.sameDateLastYear).toHaveBeenCalledWith(expect.any(Date));
        });

        it("defines last day from same month last year", async () => {
            await scdlDepositCronService.getDepositsSameMonthLastYear();
            expect(DateHelper.lastDayInMonth).toHaveBeenCalledWith(LAST_YEAR);
        });

        it("calls deposit log ports to find needed deposits", async () => {
            await scdlDepositCronService.getDepositsSameMonthLastYear();
            expect(mockDepositLogPort.findFromPeriod).toHaveBeenCalledWith(START, END);
        });

        it("returns deposits from same month last year", async () => {
            const expected = SAME_MONTH_LAST_YEAR_DEPOSITS;
            const actual = await scdlDepositCronService.getDepositsSameMonthLastYear();
            expect(actual).toEqual(expected);
        });
    });

    describe("getDepositsUserIdFromDate", () => {
        const DATE = new Date();
        beforeEach(() => {
            mockDepositLogPort.findAllFromFullDay.mockResolvedValue(DEPOSIT_LOGS);
        });

        it("gets deposits", async () => {
            await scdlDepositCronService.getDepositsUserIdFromDate(DATE);
            expect(mockDepositLogPort.findAllFromFullDay).toHaveBeenCalledWith(DATE);
        });
        it("return null if no deposit on date", async () => {
            mockDepositLogPort.findAllFromFullDay.mockResolvedValueOnce(null);
            const expected = null;
            const actual = await scdlDepositCronService.getDepositsUserIdFromDate(DATE);
            expect(actual).toEqual(expected);
        });

        it("returns deposits user id", async () => {
            const expected = DEPOSIT_LOGS.map(deposit => deposit.userId);
            const actual = await scdlDepositCronService.getDepositsUserIdFromDate(DATE);
            expect(actual).toEqual(expected);
        });
    });

    describe("notifyUsers", () => {
        let mockGetUsersToNotify: jest.SpyInstance;

        beforeEach(() => {
            mockGetUsersToNotify = jest
                .spyOn(scdlDepositCronService, "getUsersEmailToNotify")
                .mockResolvedValue(USERS.map(user => user.email));
        });

        afterAll(() => {
            mockGetUsersToNotify.mockRestore();
        });

        it("gets users to notify", async () => {
            await scdlDepositCronService.notifyUsers();
            expect(mockGetUsersToNotify).toHaveBeenCalledTimes(1);
        });

        it("notify all users", async () => {
            await scdlDepositCronService.notifyUsers();
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.BATCH_DEPOSIT_RESUME, {
                emails: [USERS[0].email, USERS[1].email],
            });
        });
    });

    describe("notifyDepositRenewal", () => {
        const DEPOSITS: DepositScdlLogEntity[] = DEPOSIT_LOGS.map(deposit => ({ ...deposit, updateDate: LAST_YEAR }));
        const USERS = [{ email: "foo.bar@gouv.fr" }, { email: "fez.boo@gouv.fr" }] as UserDto[];
        let mockGetDepositsSameMontLastYear: jest.SpyInstance;

        beforeEach(() => {
            mockGetDepositsSameMontLastYear = jest
                .spyOn(scdlDepositCronService, "getDepositsSameMonthLastYear")
                .mockResolvedValue(DEPOSITS);
            jest.mocked(userCrudService.findUsersByIdList).mockResolvedValue(USERS);
        });

        afterAll(() => mockGetDepositsSameMontLastYear.mockRestore());

        it("gets deposits made last year for current month", async () => {
            await scdlDepositCronService.notifyDepositRenewal();
            expect(mockGetDepositsSameMontLastYear).toHaveBeenCalled();
        });

        it("gets deposits' users", async () => {
            await scdlDepositCronService.notifyDepositRenewal();
            expect(userCrudService.findUsersByIdList).toHaveBeenCalledWith(DEPOSITS.map(deposit => deposit.userId));
        });

        it("do not notify service if no deposits found for period", async () => {
            mockGetDepositsSameMontLastYear.mockResolvedValueOnce(null);
            await scdlDepositCronService.notifyDepositRenewal();
            expect(notifyService.notify).not.toHaveBeenCalled();
        });

        it("notify users to renew their deposit", async () => {
            await scdlDepositCronService.notifyDepositRenewal();
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.BATCH_DEPOSIT_RENEWAL, {
                emails: USERS.map(user => user.email),
            });
        });
    });
});
