import { DefaultObject } from "../../../../@types";
import userRepository from "../../repositories/user.repository";

export class UserCrudService {
    find(query: DefaultObject = {}) {
        return userRepository.find(query);
    }

    findByEmail(email: string) {
        return userRepository.findByEmail(email);
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;
