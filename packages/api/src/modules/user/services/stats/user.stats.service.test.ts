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

// fixtures users with nb visits updated
const PARTIAL_USERS = [
    { _id: "67a480e7dd6e57423b7f0825", nbVisits: 34, email: "john.doe@gouv.fr" },
    { _id: "67a480f671757a46cd1b9461", nbVisits: 13, email: "thomas.martin@gouv.fr" },
];

const OMIT_ID_PARTIAL_USERS = PARTIAL_USERS.map(user => ({ email: user.email, nbVisits: user.nbVisits }));

// fixtures update nb requests for users calculated from statsAssociationsVisitPort
const COUNT_BY_USER = [
    { _id: PARTIAL_USERS[0]._id, count: 16 },
    { _id: PARTIAL_USERS[1]._id, count: 2 },
];

describe("user stats service", () => {
    beforeAll(() => mockedUserPort.findPartialUsersById.mockResolvedValue(OMIT_ID_PARTIAL_USERS));

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
        const mockUpdateByDateSpy: jest.SpyInstance = jest.spyOn(userStatsService, "updateNbRequestsByDate");

        beforeAll(() => {
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
        const mockUpdateNbRequestsInBrevo: jest.SpyInstance = jest.spyOn(userStatsService, "updateNbRequestsInBrevo");

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
            expect(mockUpdateNbRequestsInBrevo).toHaveBeenCalledWith(COUNT_BY_USER.map(element => element._id));
        });
    });

    describe("updateNbRequestsInBrevo", () => {
        it("retrieve users email and nbVisits", async () => {
            const USERS_ID = COUNT_BY_USER.map(element => element._id);
            // @ts-expect-error: test protected method
            await userStatsService.updateNbRequestsInBrevo(USERS_ID);
            expect(userPort.findPartialUsersById).toHaveBeenCalledWith(USERS_ID, ["email", "nbVisits"]);
        });

        it("should notify STATS_NB_REQUESTS", async () => {
            const expected = OMIT_ID_PARTIAL_USERS;
            jest.spyOn(userPort, "findPartialUsersById").mockResolvedValue(expected);
            // @ts-expect-error: test protected method
            await userStatsService.updateNbRequestsInBrevo(COUNT_BY_USER);
            expect(jest.mocked(notifyService.notify)).toHaveBeenCalledWith(
                NotificationType.STATS_NB_REQUESTS,
                expected,
            );
        });
    });
});
