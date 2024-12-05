import userStatsService from "./user.stats.service";
import userRepository from "../../repositories/user.repository";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
jest.mock("../crud/user.crud.service");
import userCrudService from "../crud/user.crud.service";
import { UserDto } from "dto";

describe("user stats service", () => {
    describe("countTotalUsersOnDate()", () => {
        const REPO_RETURN = 5;
        const DATE = new Date();
        const WITH_ADMIN = true;

        beforeAll(() => mockedUserRepository.countTotalUsersOnDate.mockResolvedValue(REPO_RETURN));
        afterAll(() => mockedUserRepository.countTotalUsersOnDate.mockRestore());

        it("should call repo with given args", async () => {
            await userStatsService.countTotalUsersOnDate(DATE, WITH_ADMIN);
            expect(mockedUserRepository.countTotalUsersOnDate).toBeCalledWith(DATE, WITH_ADMIN);
        });

        it("should call repo with default", async () => {
            await userStatsService.countTotalUsersOnDate(DATE);
            expect(mockedUserRepository.countTotalUsersOnDate).toBeCalledWith(DATE, false);
        });

        it("should return repo's return value", async () => {
            const expected = REPO_RETURN;
            const actual = await userStatsService.countTotalUsersOnDate(DATE);
            expect(actual).toBe(expected);
        });
    });

    describe("findByPeriod()", () => {
        const REPO_RETURN = {};
        const END = new Date();
        const BEGIN = new Date(END.getFullYear() - 1, END.getMonth(), END.getDay() + 1);
        const WITH_ADMIN = true;

        // @ts-expect-error: mock return value
        beforeAll(() => mockedUserRepository.findByPeriod.mockResolvedValue(REPO_RETURN));
        afterAll(() => mockedUserRepository.findByPeriod.mockReset());

        it("should call repo with given args", async () => {
            await userStatsService.findByPeriod(BEGIN, END, WITH_ADMIN);
            expect(mockedUserRepository.findByPeriod).toBeCalledWith(BEGIN, END, WITH_ADMIN);
        });

        it("should call repo with default", async () => {
            await userStatsService.findByPeriod(BEGIN, END);
            expect(mockedUserRepository.findByPeriod).toBeCalledWith(BEGIN, END, false);
        });

        it("should return repo's return value", async () => {
            const expected = REPO_RETURN;
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
