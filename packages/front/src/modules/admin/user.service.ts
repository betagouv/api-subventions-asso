import User from "../../@types/User";
import apiDatasubService from "../../shared/apiDatasub.service";

export class AdminService {

    async listUsers(user: User) {
        try {
            const result = await apiDatasubService.listUser(user);
            return { type: "SUCCESS", data: result.data.users };
        } catch (e) {
            return { type: "ERROR" }
        }
    }

    async createUser(email: string, user: User) {
        try {
            const result = await apiDatasubService.createUser(email, user);

            if (result.data.success) {
                return { type: "SUCCESS" };
            }
            return { type: "ERROR" }
        } catch (e) {
            return { type: "ERROR" }
        }
    }
}

const adminService = new AdminService();

export default adminService;