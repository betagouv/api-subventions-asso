import { UserDto } from "dto";
import { DefaultObject } from "../../../../@types";
import userRepository from "../../repositories/user.repository";
import userCheckService from "../check/user.check.service";

export class UserCrudService {
    find(query: DefaultObject = {}) {
        return userRepository.find(query);
    }

    findByEmail(email: string) {
        return userRepository.findByEmail(email);
    }

    public async update(user: Partial<UserDto> & Pick<UserDto, "email">): Promise<UserDto> {
        await userCheckService.validateEmail(user.email);
        return await userRepository.update(user);
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;
