import { AgentTypeEnum } from "dto";
import userProfileService from "./user.profile.service";
import userCheckService from "../check/user.check.service";
import * as stringHelper from "../../../../shared/helpers/StringHelper";
import { USER_ACTIVATION_INFO, USER_DBO, USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(stringHelper);
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
import userRepository from "../../repositories/user.repository";
import { NotificationType } from "../../../notify/@types/NotificationType";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import notifyService from "../../../notify/notify.service";
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
        const mockValidateUserProfileData = jest.spyOn(userProfileService, "validateUserProfileData");
        const mockSanitizeUserProfileData = jest.spyOn(userProfileService, "sanitizeUserProfileData");

        const mockList = [mockValidateUserProfileData, mockSanitizeUserProfileData];

        beforeAll(() => {
            mockValidateUserProfileData.mockReturnValue({ valid: true });
            mockSanitizeUserProfileData.mockImplementation(userInfo => userInfo);
            mockedUserRepository.update.mockResolvedValue({ ...USER_DBO, ...USER_ACTIVATION_INFO });
        });

        afterAll(() => mockList.forEach(mock => mock.mockRestore()));

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
});
