import axios from "axios";

export class AdminService {
    async getUsers() {
        const path = `/user/admin/list-users`;
        return axios.get(path).then(result => {
            return result.data.users;
        });
    }

    async deleteUser(userId) {
        const path = `/user/admin/user/${userId}`;
        return axios.delete(path).then(result => {
            return result.status == 204;
        });
    }
}

const adminService = new AdminService();

export default adminService;
