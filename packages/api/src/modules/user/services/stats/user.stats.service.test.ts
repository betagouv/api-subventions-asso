import userStatsService from "./user.stats.service";
import userPort from "../../../../dataProviders/db/user/user.port";
jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserPort = jest.mocked(userPort);
jest.mock("../crud/user.crud.service");
import userCrudService from "../crud/user.crud.service";
import { UserDto } from "dto";

describe("user stats service", () => {
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
});
