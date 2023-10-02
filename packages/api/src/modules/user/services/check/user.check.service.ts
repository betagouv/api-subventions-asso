import { REGEX_PASSWORD } from "../../user.constant";

export class UserCheckService {
    passwordValidator(password: string): boolean {
        return REGEX_PASSWORD.test(password);
    }
}

const userCheckService = new UserCheckService();
export default userCheckService;
