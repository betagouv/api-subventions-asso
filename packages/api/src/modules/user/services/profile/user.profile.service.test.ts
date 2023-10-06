import {
    UNACTIVATED_USER,
    USER_ACTIVATION_INFO,
    USER_DBO,
    USER_SECRETS,
    USER_WITHOUT_SECRET,
} from "../../__fixtures__/user.fixture";
import { AgentTypeEnum } from "dto";
import userProfileService from "./user.profile.service";

import * as stringHelper from "../../../../shared/helpers/StringHelper";
jest.mock("../../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(stringHelper);
import userAuthService from "../auth/user.auth.service";
jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
import userCheckService from "../check/user.check.service";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userActivationService from "../activation/user.activation.service";
jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);
import userCrudService from "../crud/user.crud.service";
jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
import { NotificationType } from "../../../notify/@types/NotificationType";
import userRepository from "../../repositories/user.repository";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import userResetRepository from "../../repositories/user-reset.repository";
jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
import notifyService from "../../../notify/notify.service";
import { ObjectId } from "mongodb";
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);

describe("user profile service", () => {
    describe("validateUserProfileData()", () => {
        const validInput = {
            password: "m0t de Passe.",
            agentType: AgentTypeEnum.OPERATOR,
            jobType: [],
        };

        describe("password", () => {
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementationOnce(() => false));
            it("should throw password is wrong", () => {
                const actual = userProfileService.validateUserProfileData({
                    ...validInput,
                    password: "PA$$W0RD",
                });
                expect(actual).toMatchSnapshot();
            });

            it("does not check password if arg does not require it ", () => {
                const expected = { valid: true };
                const actual = userProfileService.validateUserProfileData(
                    {
                        ...validInput,
                        password: "PA$$W0RD",
                    },
                    false,
                );
                expect(actual).toEqual(expected);
            });
        });

        describe("agentType", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw if agentType is wrong", () => {
                const actual = userProfileService.validateUserProfileData({
                    ...validInput,
                    agentType: "WRONG_VALUE",
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("typeJob", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                const actual = userProfileService.validateUserProfileData({
                    ...validInput,
                    agentType: "WRONG_VALUE",
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("structure", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                const actual = userProfileService.validateUserProfileData({
                    ...validInput,
                    structure: 6,
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("territorialScope", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                const actual = userProfileService.validateUserProfileData({
                    ...validInput,
                    territorialScope: "WRONG_SCOPE",
                });
                expect(actual).toMatchSnapshot();
            });
            it("should return true", () => {
                const expected = { valid: true };

                const actual = userProfileService.validateUserProfileData(validInput);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("sanitizeActivationUserInfo()", () => {
        it("should call sanitizeToPlainText()", () => {
            const expected = 2;
            userProfileService.sanitizeUserProfileData(USER_ACTIVATION_INFO);
            expect(mockedStringHelper.sanitizeToPlainText).toHaveBeenCalledTimes(expected);
        });

        it("does not add field", () => {
            mockedStringHelper.sanitizeToPlainText.mockReturnValueOnce("santitized");
            const expected = 1;
            const sanitized = userProfileService.sanitizeUserProfileData({ service: "smth" });
            const actual = Object.keys(sanitized).length;
            expect(actual).toBe(expected);
        });
    });

    describe("profileUpdate", () => {
        let mockValidateUserProfileData: jest.SpyInstance;
        let mockSanitizeUserProfileData: jest.SpyInstance;

        beforeAll(() => {
            mockValidateUserProfileData = jest.spyOn(userProfileService, "validateUserProfileData");
            mockSanitizeUserProfileData = jest.spyOn(userProfileService, "sanitizeUserProfileData");
            mockValidateUserProfileData.mockReturnValue({ valid: true });
            mockSanitizeUserProfileData.mockImplementation(userInfo => userInfo);
            mockedUserRepository.update.mockResolvedValue({ ...USER_DBO, ...USER_ACTIVATION_INFO });
        });

        afterAll(() => {
            mockValidateUserProfileData.mockRestore();
            mockSanitizeUserProfileData.mockRestore();
            mockedUserRepository.update.mockReset();
        });

        it("should call validateUserProfileData() without testing password", async () => {
            const expected = { ...USER_WITHOUT_SECRET, ...USER_ACTIVATION_INFO };
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(mockValidateUserProfileData).toHaveBeenCalledWith(expected, false);
        });

        it("should call sanitizeUserProfileData()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(mockSanitizeUserProfileData).toHaveBeenCalledWith(expected);
        });

        it("should call userRepository.update() with sanitized data", async () => {
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(userRepository.update).toHaveBeenCalledWith({ ...USER_WITHOUT_SECRET, ...USER_ACTIVATION_INFO });
        });

        it("should notify user updated", async () => {
            mockedUserRepository.update.mockResolvedValue(USER_WITHOUT_SECRET);
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(mockedNotifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, USER_WITHOUT_SECRET);
        });
    });

    describe("activate", () => {
        const RESET_DOCUMENT = {
            _id: new ObjectId(),
            userId: new ObjectId(),
            token: "qdqzd234234ffefsfsf!",
            createdAt: new Date(),
        };

        let mockValidateUserProfileData: jest.SpyInstance;
        let mockSanitizeUserProfileData: jest.SpyInstance;

        const mockResetList = [
            mockedUserResetRepository.findByToken,
            mockedUserActivationService.validateResetToken,
            mockedUserAuthService.updateJwt,
        ];

        beforeAll(() => {
            mockValidateUserProfileData = jest.spyOn(userProfileService, "validateUserProfileData");
            mockSanitizeUserProfileData = jest.spyOn(userProfileService, "sanitizeUserProfileData");
            mockValidateUserProfileData.mockReturnValue({ valid: true });
            mockSanitizeUserProfileData.mockImplementation(userInfo => userInfo);

            mockedUserResetRepository.findByToken.mockImplementation(async token => RESET_DOCUMENT);
            mockedUserCrudService.getUserById.mockImplementation(async id => UNACTIVATED_USER);
            mockedUserActivationService.validateResetToken.mockImplementation(token => ({ valid: true }));
            mockedUserAuthService.getHashPassword.mockImplementation(async password => Promise.resolve(password));
            // @ts-expect-error: unknown error
            mockedUserRepository.update.mockImplementation(() => ({
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
            }));
            mockedUserAuthService.updateJwt.mockImplementation(async user => ({ ...user, jwt: USER_SECRETS.jwt }));
        });

        afterAll(() => {
            mockValidateUserProfileData.mockRestore();
            mockSanitizeUserProfileData.mockRestore();
            mockResetList.forEach(mock => mock.mockReset());
        });

        it("should call userRepository.update()", async () => {
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(userRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should notify user updated", async () => {
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, {
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
                jwt: USER_SECRETS.jwt,
            });
        });

        it("should call validateUserProfileData()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(mockValidateUserProfileData).toHaveBeenCalledWith(expected);
        });

        it("should call validateAndSanitizeActivationUserInfo()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(mockSanitizeUserProfileData).toHaveBeenCalledWith(expected);
        });

        it("update user's jwt", async () => {
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(mockedUserAuthService.updateJwt).toHaveBeenCalledWith({
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
            });
        });

        it("returns user with jwt", async () => {
            const expected = {
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
                jwt: USER_SECRETS.jwt,
            };
            const actual = await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(actual).toEqual(expected);
        });
    });
});
