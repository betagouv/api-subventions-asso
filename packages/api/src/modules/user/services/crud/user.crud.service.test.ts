import userCrudService from "./user.crud.service";
import userRepository from "../../repositories/user.repository";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);
import userCheckService from "../check/user.check.service";
jest.mock("../check/user.check.service");
const mockedUserCheckService = jest.mocked(userCheckService);

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
});
