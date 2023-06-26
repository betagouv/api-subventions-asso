import requestsService from "@services/requests.service";

export class UserPort {
    BASE_PATH = "/user";

    deleteSelfUser() {
        return requestsService.delete(this.BASE_PATH);
    }
}

const userPort = new UserPort();
export default userPort;
