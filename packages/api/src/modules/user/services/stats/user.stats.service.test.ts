import userStatsService from "./user.stats.service";
import userRepository from "../../../../dataProviders/db/user/user.port";
jest.mock("../../../../dataProviders/db/user/user.port");
const mockedUserRepository = jest.mocked(userRepository);
import userAssociationVisitJoiner from "../../../stats/joiners/UserAssociationVisitsJoiner";
import { USER_DBO, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../../stats/joiners/UserAssociationVisitsJoiner");
const mockedUserAssociationVisitJoiner = jest.mocked(userAssociationVisitJoiner);
import * as dateHelper from "../../../../shared/helpers/DateHelper";
import AssociationVisitEntity from "../../../stats/entities/AssociationVisitEntity";
jest.mock("../../../../shared/helpers/DateHelper");
const mockedDateHelper = jest.mocked(dateHelper);

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
        const MOST_RECENT_DATE = new Date();
        const ASSOCIATION_VISIT = {
            associationIdentifier: "rna",
            userId: USER_WITHOUT_SECRET._id,
            date: MOST_RECENT_DATE,
        };
        beforeAll(() => {
            mockedUserAssociationVisitJoiner.findUsersWithAssociationVisits.mockImplementation(async () => [
                {
                    ...USER_WITHOUT_SECRET,
                    associationVisits: [ASSOCIATION_VISIT],
                },
            ]);
            mockedDateHelper.getMostRecentDate.mockImplementation(() => MOST_RECENT_DATE);
        });

        afterAll(() => {
            mockedUserAssociationVisitJoiner.findUsersWithAssociationVisits.mockReset();
            mockedDateHelper.getMostRecentDate.mockReset();
        });

        it("should call userAssociationVisitJoiner.findUsersWithAssociationVisits()", async () => {
            await userStatsService.getUsersWithStats();
            expect(mockedUserAssociationVisitJoiner.findUsersWithAssociationVisits).toHaveBeenCalledTimes(1);
        });

        it("should call DateHelper.getMostRecentDate()", async () => {
            await userStatsService.getUsersWithStats();
            expect(mockedDateHelper.getMostRecentDate).toHaveBeenCalledTimes(1);
        });

        it("should return user with stats", async () => {
            const expected = [{ ...USER_WITHOUT_SECRET, stats: { lastSearchDate: MOST_RECENT_DATE, searchCount: 1 } }];
            const actual = await userStatsService.getUsersWithStats();
            expect(actual).toEqual(expected);
        });
    });
});
