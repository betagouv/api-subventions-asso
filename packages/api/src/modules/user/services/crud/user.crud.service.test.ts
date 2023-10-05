import userCrudService from "./user.crud.service";
import userRepository from "../../repositories/user.repository";
import { USER_EMAIL } from "../../../../../tests/__helpers__/userHelper";
jest.mock("../../repositories/user.repository");
const mockedUserRepository = jest.mocked(userRepository);

describe("user crud service", () => {
    describe("findByEmail", () => {
        it("should call userRepository.findByEmail", async () => {
            await userCrudService.findByEmail(USER_EMAIL);
            expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(USER_EMAIL);
        });
    });
});
