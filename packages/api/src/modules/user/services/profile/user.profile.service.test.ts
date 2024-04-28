import {
    UNACTIVATED_USER,
    USER_ACTIVATION_INFO,
    USER_DBO,
    USER_SECRETS,
    USER_WITHOUT_SECRET,
} from "../../__fixtures__/user.fixture";
import { AdminTerritorialLevel, AgentTypeEnum, UpdatableUser, UserActivationInfoDto } from "dto";
import userProfileService from "./user.profile.service";

import * as stringHelper from "../../../../shared/helpers/StringHelper";
import userAuthService from "../auth/user.auth.service";
import userCheckService from "../check/user.check.service";
import userActivationService from "../activation/user.activation.service";
import userCrudService from "../crud/user.crud.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userRepository from "../../repositories/user.repository";
import userResetRepository from "../../repositories/user-reset.repository";
import notifyService from "../../../notify/notify.service";
import { ObjectId } from "mongodb";
import geoService from "../../../providers/geoApi/geo.service";
import userAgentConnectService from "../agentConnect/user.agentConnect.service";

jest.mock("../../../providers/geoApi/geo.service");
jest.mock("../agentConnect/user.agentConnect.service");

jest.mock("../../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(stringHelper);
jest.mock("../auth/user.auth.service");
const mockedUserAuthService = jest.mocked(userAuthService);
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);
jest.mock("../activation/user.activation.service");
const mockedUserActivationService = jest.mocked(userActivationService);
jest.mock("../crud/user.crud.service");
const mockedUserCrudService = jest.mocked(userCrudService);
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
jest.mock("../../repositories/user-reset.repository");
const mockedUserResetRepository = jest.mocked(userResetRepository);
jest.mock("../../../notify/notify.service", () => ({
    notify: jest.fn(),
}));
const mockedNotifyService = jest.mocked(notifyService);

describe("user profile service", () => {
    let deduceRegionSpy: jest.SpyInstance;
    beforeAll(() => {
        // @ts-expect-error -- private spy
        deduceRegionSpy = jest.spyOn(userProfileService, "deduceRegion");
    });

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
                    // @ts-expect-error -- test errors in input
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
                    // @ts-expect-error -- test errors in input
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
                    // @ts-expect-error -- test errors in input
                    structure: 6,
                });
                expect(actual).toMatchSnapshot();
            });
        });

        describe("region", () => {
            const mockList = [mockedUserCheckService.passwordValidator];
            beforeAll(() => mockedUserCheckService.passwordValidator.mockImplementation(() => true));
            afterAll(() => mockList.forEach(mock => mock.mockReset()));
            it("should throw an error", () => {
                const actual = userProfileService.validateUserProfileData({
                    ...validInput,
                    // @ts-expect-error -- test errors in input
                    region: 6,
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
                    // @ts-expect-error -- test errors in input
                    territorialScope: "WRONG_SCOPE",
                });
                expect(actual).toMatchSnapshot();
            });
            it("should return true", () => {
                const expected = { valid: true };

                const actual = userProfileService.validateUserProfileData(validInput);
                expect(actual).toEqual(expected);
            });
            // TODO question : laisser le test comme ça ou extraire des tests ?
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
            jest.mocked(userAgentConnectService.agentConnectUpdateValidations).mockReturnValue({ valid: true });
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

        it("throws if agentConnectUpdate validation is falsy", async () => {
            const expected = { ...USER_WITHOUT_SECRET, ...USER_ACTIVATION_INFO };
            const ERROR = new Error("test");
            jest.mocked(userAgentConnectService.agentConnectUpdateValidations).mockReturnValueOnce({
                valid: false,
                error: ERROR,
            });
            const test = userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            await expect(test).rejects.toMatchObject(ERROR);
        });

        it("should call sanitizeUserProfileData()", async () => {
            const expected = USER_ACTIVATION_INFO;
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(mockSanitizeUserProfileData).toHaveBeenCalledWith(expected);
        });

        it("calls deduceRegion with sanitized data", async () => {
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(deduceRegionSpy).toHaveBeenCalledWith(USER_ACTIVATION_INFO);
        });

        it("should call userRepository.update() with sanitized and completed data", async () => {
            deduceRegionSpy.mockImplementationOnce(data => (data.modified = true));
            await userProfileService.profileUpdate(USER_WITHOUT_SECRET, USER_ACTIVATION_INFO);
            expect(userRepository.update).toHaveBeenCalledWith({
                modified: true,
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
            });
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
            // TODO mock deduceRegion
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
            await userProfileService.activate("token", { ...USER_ACTIVATION_INFO });
            expect(userRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should notify user updated", async () => {
            await userProfileService.activate("token", { ...USER_ACTIVATION_INFO });
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_UPDATED, {
                ...USER_WITHOUT_SECRET,
                ...USER_ACTIVATION_INFO,
            });
        });

        it("should notify user activated", async () => {
            await userProfileService.activate("token", { ...USER_ACTIVATION_INFO });
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_ACTIVATED, {
                email: USER_WITHOUT_SECRET.email,
            });
        });

        it("should notify user logged in", async () => {
            await userProfileService.activate("token", { ...USER_ACTIVATION_INFO });
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.USER_LOGGED, {
                email: USER_WITHOUT_SECRET.email,
                date: expect.any(Date),
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

        it("calls deduceRegion with sanitized data", async () => {
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            expect(deduceRegionSpy).toHaveBeenCalledWith(USER_ACTIVATION_INFO);
        });

        it("should call userRepository.update() with sanitized and completed data", async () => {
            deduceRegionSpy.mockImplementationOnce(data => (data.modified = true));
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            // @ts-expect-error -- test
            const actual = jest.mocked(userRepository.update).mock?.calls?.[0]?.[0]?.modified;
            expect(actual).toBeTruthy();
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

        it("sets lastActivityDate", async () => {
            await userProfileService.activate("token", USER_ACTIVATION_INFO);
            const actual = jest.mocked(userRepository.update).mock.calls[0][0]?.lastActivityDate;

            expect(actual).toEqual(expect.any(Date));
        });
    });

    describe("deduceRegion", () => {
        const REGION = "Région";
        const DEPARTMENT = "00 - Département";
        let USER_INFO: Partial<UpdatableUser> | UserActivationInfoDto;

        it("does nothing if not decentralized admin agent", async () => {
            USER_INFO = { agentType: AgentTypeEnum.CENTRAL_ADMIN };
            const expected = { ...USER_INFO };
            // @ts-expect-error -- private spy
            await userProfileService.deduceRegion(USER_INFO);
            const actual = USER_INFO; // modifies args
            expect(actual).toEqual(expected);
        });

        it("copies territory to region if level is regional", async () => {
            USER_INFO = {
                agentType: AgentTypeEnum.DECONCENTRATED_ADMIN,
                decentralizedLevel: AdminTerritorialLevel.REGIONAL,
                decentralizedTerritory: REGION,
            };
            const expected = REGION;
            // @ts-expect-error -- private spy
            await userProfileService.deduceRegion(USER_INFO);
            const actual = USER_INFO.region; // modifies args
            expect(actual).toBe(expected);
        });

        it("calls geoService if level is departmental", async () => {
            USER_INFO = {
                agentType: AgentTypeEnum.DECONCENTRATED_ADMIN,
                decentralizedLevel: AdminTerritorialLevel.DEPARTMENTAL,
                decentralizedTerritory: DEPARTMENT,
            };
            jest.mocked(geoService.getRegionFromDepartment).mockResolvedValueOnce(REGION);
            // @ts-expect-error -- private spy
            await userProfileService.deduceRegion(USER_INFO);
            expect(geoService.getRegionFromDepartment).toHaveBeenCalledWith(DEPARTMENT);
        });

        it("sets region to value from geoService if level is departmental", async () => {
            USER_INFO = {
                agentType: AgentTypeEnum.DECONCENTRATED_ADMIN,
                decentralizedLevel: AdminTerritorialLevel.DEPARTMENTAL,
                decentralizedTerritory: DEPARTMENT,
            };
            jest.mocked(geoService.getRegionFromDepartment).mockResolvedValueOnce(REGION);
            const expected = REGION;
            // @ts-expect-error -- private spy
            await userProfileService.deduceRegion(USER_INFO);
            const actual = USER_INFO.region; // modifies args
            expect(actual).toBe(expected);
        });
    });

    // TODO sanitizeUserProfileData also calls agentConnectUpdateValidations and removeSecrets
});
