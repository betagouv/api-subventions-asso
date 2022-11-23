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

    async create(email) {
        const path = `/user/admin/create-user`;
        return axios.post(path, { email }).then(result => {
            return result.status == 201;
        });
    }
}

const adminService = new AdminService();

export default adminService;
