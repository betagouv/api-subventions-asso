import userStatsService from "./user.stats.service";
import userPort from "../../../../dataProviders/db/user/user.port";
jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
import userCrudService from "../crud/user.crud.service";
jest.mock("../crud/user.crud.service");
import { UserDto } from "dto";
import notifyService from "../../../notify/notify.service";
jest.mock("../../../notify/notify.service", () => ({ notify: jest.fn() }));
import { NotificationType } from "../../../notify/@types/NotificationType";
import statsAssociationsVisitPort from "../../../../dataProviders/db/stats/statsAssociationsVisit.port";
jest.mock("../../../../dataProviders/db/stats/statsAssociationsVisit.port");
import configurationsService from "../../../configurations/configurations.service";
jest.mock("../../../configurations/configurations.service");

const COUNT_BY_USER = [
    { _id: "67a480e7dd6e57423b7f0825", count: 16 },
    { _id: "67a480f671757a46cd1b9461", count: 2 },
];

const IDS_WITH_EMAIL = [
    { _id: "67a480e7dd6e57423b7f0825", email: "john.doe@gouv.fr" },
    { _id: "67a480f671757a46cd1b9461", email: "thomas.martin@gouv.fr" },
];

describe("user stats service", () => {
    beforeEach(() => {
        mockedUserPort.findEmails.mockResolvedValue(IDS_WITH_EMAIL);
    });

    describe("countTotalUsersOnDate()", () => {
        const PORT_RETURN = 5;
        const DATE = new Date();
        const WITH_ADMIN = true;

        beforeAll(() => mockedUserPort.countTotalUsersOnDate.mockResolvedValue(PORT_RETURN));
        afterAll(() => mockedUserPort.countTotalUsersOnDate.mockRestore());

        it("should call port with given args", async () => {
            await userStatsService.countTotalUsersOnDate(DATE, WITH_ADMIN);
            expect(mockedUserPort.countTotalUsersOnDate).toBeCalledWith(DATE, WITH_ADMIN);
        });

        it("should call port with default", async () => {
            await userStatsService.countTotalUsersOnDate(DATE);
            expect(mockedUserPort.countTotalUsersOnDate).toBeCalledWith(DATE, false);
        });

        it("should return port's return value", async () => {
            const expected = PORT_RETURN;
            const actual = await userStatsService.countTotalUsersOnDate(DATE);
            expect(actual).toBe(expected);
        });
    });

    describe("findByPeriod()", () => {
        const PORT_RETURN = {};
        const END = new Date();
        const BEGIN = new Date(END.getFullYear() - 1, END.getMonth(), END.getDay() + 1);
        const WITH_ADMIN = true;

        // @ts-expect-error: mock return value
        beforeAll(() => mockedUserPort.findByPeriod.mockResolvedValue(PORT_RETURN));
        afterAll(() => mockedUserPort.findByPeriod.mockReset());

        it("should call port with given args", async () => {
            await userStatsService.findByPeriod(BEGIN, END, WITH_ADMIN);
            expect(mockedUserPort.findByPeriod).toBeCalledWith(BEGIN, END, WITH_ADMIN);
        });

        it("should call port with default", async () => {
            await userStatsService.findByPeriod(BEGIN, END);
            expect(mockedUserPort.findByPeriod).toBeCalledWith(BEGIN, END, false);
        });

        it("should return port's return value", async () => {
            const expected = PORT_RETURN;
            const actual = await userStatsService.findByPeriod(BEGIN, END);
            expect(actual).toBe(expected);
        });
    });

    describe("getUsersWithStats", () => {
        const PROMISE = "PROMISE" as unknown as Promise<UserDto[]>;

        beforeAll(() => {
            jest.mocked(userCrudService.find).mockReturnValueOnce(PROMISE);
        });

        afterAll(() => {
            jest.mocked(userCrudService.find).mockRestore();
        });

        it("should call crud", async () => {
            await userStatsService.getUsersWithStats();
            expect(userCrudService.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateNbRequests", () => {
        const SINCE = new Date("2022-01-16");
        const UNTIL = new Date("2024-09-09");

        // @ts-expect-error: mock private method
        const mockUpdateByDateSpy = jest.spyOn(userStatsService, "updateNbRequestsByDate");

        beforeAll(() => {
            // @ts-expect-error -- private method
            mockUpdateByDateSpy.mockResolvedValue(null);
            jest.useFakeTimers().setSystemTime(UNTIL);
            jest.mocked(configurationsService.getLastUserStatsUpdate).mockResolvedValue(SINCE);
        });

        afterAll(() => {
            mockUpdateByDateSpy.mockRestore();
            jest.useRealTimers();
            jest.mocked(configurationsService.getLastUserStatsUpdate).mockRestore();
        });

        it("calls updateNbRequestsByDate", async () => {
            await userStatsService.updateNbRequests();
            expect(mockUpdateByDateSpy).toHaveBeenCalledWith(SINCE, UNTIL);
        });
    });

    describe("updateNbRequestsByDate", () => {
        // @ts-expect-error: mock private method
        const mockUpdateNbRequestsInBrevo = jest.spyOn(userStatsService, "updateNbRequestsInBrevo");

        beforeEach(() => {
            mockUpdateNbRequestsInBrevo.mockImplementation();
            jest.mocked(statsAssociationsVisitPort.findGroupedByUserIdentifierOnPeriod).mockResolvedValue([
                { _id: COUNT_BY_USER[0]._id, associationVisits: Array(COUNT_BY_USER[0].count) },
                { _id: COUNT_BY_USER[1]._id, associationVisits: Array(COUNT_BY_USER[1].count) },
            ]);
        });

        afterAll(() => {
            mockUpdateNbRequestsInBrevo.mockRestore();
        });

        const SINCE = new Date("2024-02-01");
        const UNTIL = new Date("2024-02-08");

        it("retrieve users requests number", async () => {
            // @ts-expect-error: test private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(statsAssociationsVisitPort.findGroupedByUserIdentifierOnPeriod).toHaveBeenCalledWith(SINCE, UNTIL);
        });

        it("update users requests number in database", async () => {
            // @ts-expect-error: test private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(userPort.updateNbRequests).toHaveBeenCalledWith(COUNT_BY_USER);
        });

        it("notify brevo to update users requests", async () => {
            // @ts-expect-error: test private method
            await userStatsService.updateNbRequestsByDate(SINCE, UNTIL);
            expect(mockUpdateNbRequestsInBrevo).toHaveBeenCalledWith(COUNT_BY_USER);
        });
    });

    describe("updateNbRequestsInBrevo", () => {
        it("retrieve users email from userPort", async () => {
            // @ts-expect-error: test protected method
            await userStatsService.updateNbRequestsInBrevo(COUNT_BY_USER);
            expect(userPort.findEmails).toHaveBeenCalledWith([COUNT_BY_USER[0]._id, COUNT_BY_USER[1]._id]);
        });

        it("should notify STATS_NB_REQUESTS", async () => {
            // @ts-expect-error: test protected method
            await userStatsService.updateNbRequestsInBrevo(COUNT_BY_USER);
            expect(jest.mocked(notifyService.notify)).toHaveBeenCalledWith(NotificationType.STATS_NB_REQUESTS, [
                { email: IDS_WITH_EMAIL[0].email, requests: COUNT_BY_USER[0].count },
                { email: IDS_WITH_EMAIL[1].email, requests: COUNT_BY_USER[1].count },
            ]);
        });
    });
});
