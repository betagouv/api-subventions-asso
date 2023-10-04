import userRgpdService from "./user.rgpd.service";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
jest.mock("../../repositories/consumer-token.repository");
const mockedConsumerTokenRepository = jest.mocked(consumerTokenRepository);
import statsService from "../../../stats/stats.service";
jest.mock("../../../stats/stats.service");
const mockedStatsService = jest.mocked(statsService);
import userService from "../../user.service";
jest.mock("../../user.service");
const mockedUserService = jest.mocked(userService);
import userResetRepository from "../../repositories/user-reset.repository";
import { USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
import { NotFoundError } from "../../../../shared/errors/httpErrors";
import { ObjectId } from "mongodb";
jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
import * as repositoryHelper from "../../../../shared/helpers/RepositoryHelper";
jest.mock("../../../../shared/helpers/RepositoryHelper", () => ({
    removeSecrets: jest.fn(user => user),
    uniformizeId: jest.fn(token => token),
}));

describe("user rgpd service", () => {
    describe("getAllData", () => {
        beforeEach(() => {
            mockedUserService.getUserById.mockResolvedValue(USER_WITHOUT_SECRET);
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
            expect(mockedUserService.getUserById).toBeCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("should throw error when user not found", async () => {
            mockedUserService.getUserById.mockResolvedValueOnce(null);
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
});
