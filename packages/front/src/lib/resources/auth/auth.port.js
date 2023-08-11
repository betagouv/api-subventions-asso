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
        return requestsService.post(path, { email }).then(() => true);
    }

    async validateToken(token) {
        const path = `${this.BASE_PATH}/validate-token`;
        const response = await requestsService.post(path, { token });
        return response.data;
    }
}

const authPort = new AuthPort();
export default authPort;
