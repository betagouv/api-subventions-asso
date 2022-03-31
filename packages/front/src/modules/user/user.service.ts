import User from "../../@types/User";
import apiDatasubService from "../../shared/apiDatasub.service";

export class UserService {

    async getRoles(user: User): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR", data?: unknown }> {
        try {
            const result = await apiDatasubService.getRoles(user);
            return { type: "SUCCESS", data: result.data.roles };
        } catch (e) {
            return { type: "ERROR" }
        }
    }
}

const userService = new UserService();

export default userService;