import axios from "axios";
import requestsService from "$lib/services/requests.service";

export class AuthPort {
    BASE_PATH = "/auth";

    signup(signupUser) {
        const path = `${this.BASE_PATH}/signup`;
        return requestsService
            .post(path, { email: signupUser.email, lastName: signupUser.lastname, firstName: signupUser.firstname })
            .then(result => result.data.email);
    }

    resetPassword(token, password) {
        const path = `${this.BASE_PATH}/reset-password`;
        return requestsService.post(path, { token, password }).then(() => true);
    }

    login(email, password) {
        return requestsService.post("/auth/login", { email, password }).then(value => {
            return value.data.user;
        });
    }

    forgetPassword(email) {
        const path = `${this.BASE_PATH}/forget-password`;
        return axios.post(path, { email }).then(() => true);
    }
}

const authPort = new AuthPort();
export default authPort;
