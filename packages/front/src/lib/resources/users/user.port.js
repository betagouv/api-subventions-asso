import requestsService from "$lib/services/requests.service";

export class UserPort {
    BASE_PATH = "/user";

    deleteSelfUser() {
        return requestsService.delete(this.BASE_PATH);
    }

    async getSelfUser() {
        const res = await requestsService.get(`${this.BASE_PATH}/me`);
        return res.data;
    }
}

const userPort = new UserPort();
export default userPort;
