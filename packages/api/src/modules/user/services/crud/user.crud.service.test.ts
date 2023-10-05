import userCrudService from "./user.crud.service";
import userRepository from "../../repositories/user.repository";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import userCheckService from "../check/user.check.service";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userResetRepository from "../../repositories/user-reset.repository";
jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import { NotificationType } from "../../../notify/@types/NotificationType";
jest.mock("../../repositories/consumer-token.repository");
const mockedConsumerTokenRepository = jest.mocked(consumerTokenRepository);
import notifyService from "../../../notify/notify.service";
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);

describe("user crud service", () => {
    describe("find", () => {
        it("should call userRepository.find", async () => {
            const QUERY = { _id: USER_WITHOUT_SECRET._id };
            const expected = QUERY;
            await userCrudService.find(QUERY);
            expect(mockedUserRepository.find).toHaveBeenCalledWith(expected);
        });
    });

    describe("findByEmail", () => {
        it("should call userRepository.findByEmail", async () => {
            await userCrudService.findByEmail(USER_EMAIL);
            expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });
    });

    describe("update", () => {
        beforeAll(() => {
            mockedUserCheckService.validateEmail.mockResolvedValue(undefined);
        });

        it("should call userCheckService.validateEmail()", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(mockedUserCheckService.validateEmail).toHaveBeenCalledWith(USER_WITHOUT_SECRET.email);
        });

        it("should call userRepository.update", async () => {
            await userCrudService.update(USER_WITHOUT_SECRET);
            expect(mockedUserRepository.update).toHaveBeenCalledWith(USER_WITHOUT_SECRET);
        });
    });

    describe("delete", () => {
        let mockGetUserById: jest.SpyInstance;

        beforeAll(() => {
            mockGetUserById = jest.spyOn(userCrudService, "getUserById");
            mockGetUserById.mockResolvedValue(USER_WITHOUT_SECRET);
            mockedUserRepository.delete.mockResolvedValue(true);
            mockedUserResetRepository.removeAllByUserId.mockResolvedValue(true);
            mockedConsumerTokenRepository.deleteAllByUserId.mockResolvedValue(true);
        });

        afterAll(() => {
            mockGetUserById.mockReset();
            mockedUserRepository.delete.mockReset();
            mockedUserResetRepository.removeAllByUserId.mockReset();
            mockedConsumerTokenRepository.deleteAllByUserId.mockReset();
        });

        it("gets user", async () => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(mockGetUserById).toHaveBeenCalledWith(USER_WITHOUT_SECRET._id.toString());
        });

        it("returns false if no user without calling other repos", async () => {
            mockGetUserById.mockResolvedValueOnce(null);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
            expect(mockedUserRepository.delete).not.toHaveBeenCalled();
            expect(mockedUserResetRepository.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenRepository.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                         | methodName                                       | arg
            ${mockedUserRepository.delete}                 | ${"mockedUserRepository.delete"}                 | ${USER_WITHOUT_SECRET}
            ${mockedUserResetRepository.removeAllByUserId} | ${"mockedUserResetRepository.removeAllByUserId"} | ${USER_WITHOUT_SECRET._id}
            ${consumerTokenRepository.deleteAllByUserId}   | ${"consumerTokenRepository.deleteAllByUserId"}   | ${USER_WITHOUT_SECRET._id}
        `("calls $methodName", async ({ arg, method }) => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(method).toHaveBeenCalledWith(arg);
        });

        it("returns false without other calls if mockedUserRepository.delete returns false", async () => {
            mockedUserRepository.delete.mockResolvedValueOnce(false);

            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);

            expect(mockedUserResetRepository.removeAllByUserId).not.toHaveBeenCalled();
            expect(consumerTokenRepository.deleteAllByUserId).not.toHaveBeenCalled();
        });

        it.each`
            method                                         | methodName
            ${mockedUserResetRepository.removeAllByUserId} | ${"mockedUserResetRepository.removeAllByUserId"}
            ${consumerTokenRepository.deleteAllByUserId}   | ${"consumerTokenRepository.deleteAllByUserId"}
        `("returns false if $methodName returns false", async ({ method }) => {
            method.mockResolvedValueOnce(false);
            const expected = false;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
        });

        it("returns true in case of success", async () => {
            const expected = true;
            const actual = await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(actual).toBe(expected);
        });

        it("should notify USER_DELETED", async () => {
            await userCrudService.delete(USER_WITHOUT_SECRET._id.toString());
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_DELETED, {
                email: USER_WITHOUT_SECRET.email,
                firstname: USER_WITHOUT_SECRET.firstName,
                lastname: USER_WITHOUT_SECRET.lastName,
            });
        });
    });
});
