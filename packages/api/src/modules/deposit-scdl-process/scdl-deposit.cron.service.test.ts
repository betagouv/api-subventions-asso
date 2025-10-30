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
