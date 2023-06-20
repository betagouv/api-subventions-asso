import axios from "axios";

export class UserPort {
    BASE_PATH = "/user";

    deleteSelfUser() {
        return axios.delete(this.BASE_PATH).catch(error => {
            const errorCode = error?.response?.data?.code || 500;
            throw new Error(errorCode);
        });
    }
}

const userPort = new UserPort();
export default userPort;
