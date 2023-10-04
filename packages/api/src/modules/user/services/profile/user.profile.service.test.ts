import { AgentTypeEnum } from "dto";
import userProfileService from "./user.profile.service";
import userCheckService from "../check/user.check.service";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);

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
});
