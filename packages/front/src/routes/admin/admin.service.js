import requestsService from "$lib/services/requests.service";

export class AdminService {
    async getUsers() {
        const path = `/user/admin/list-users`;
        return requestsService.get(path).then(result => {
            return result.data.users;
        });
    }

    async deleteUser(userId) {
        const path = `/user/admin/user/${userId}`;
        return requestsService.delete(path).then(result => {
            return result.status == 204;
        });
    }

    async create(email) {
        const path = `/user/admin/create-user`;
        return requestsService.post(path, { email }).then(result => {
            return result.status == 201;
        });
    }

    async addDomain(domain) {
        const path = `/config/domains`;
        return requestsService.post(path, { domain }).then(result => {
            return result.status == 201;
        });
    }

    async getMainInfoBanner() {
        const path = `/config/main-info-banner`;
        return requestsService.get(path).then(result => {
            return result.data;
        });
    }

    async updateMainInfoBanner(title, desc) {
        const path = `/config/main-info-banner`;
        return requestsService.post(path, { title, desc }).then(result => {
            return result.status == 201;
        });
    }
}

const adminService = new AdminService();

export default adminService;
