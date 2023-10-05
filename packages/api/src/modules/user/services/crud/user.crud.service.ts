import userRepository from "../../repositories/user.repository";

export class UserCrudService {
    findByEmail(email: string) {
        return userRepository.findByEmail(email);
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;
