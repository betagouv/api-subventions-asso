import userCrudService from "./user.crud.service";
import userRepository from "../../repositories/user.repository";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
import { USER_WITHOUT_SECRET } from "../../__fixtures__/user.fixture";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);

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
});
