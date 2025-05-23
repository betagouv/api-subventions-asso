import requestsService from "$lib/services/requests.service";

export class AuthPort {
    BASE_PATH = "/auth";

    async resetPassword(token, password) {
        const path = `${this.BASE_PATH}/reset-password`;
        return (await requestsService.post(path, { token, password })).data.user;
    }

    loginAgentConnect(rawSearchQueries) {
        return requestsService.get(`/auth/ac/login${rawSearchQueries}`).then(res => {
            return res.data.user;
        });
    }

    login(email, password) {
        return requestsService.post("/auth/login", { email, password }).then(value => {
            return value.data.user;
        });
    }

    logout() {
        return requestsService
            .get("/auth/logout")
            .then(res => ({ url: res.data || undefined, success: true }))
            .catch(() => ({ success: false }));
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

    async activate(token, data) {
        const path = `${this.BASE_PATH}/activate`;
        const response = await requestsService.post(path, { token, data });
        return response.data.user;
    }
}

const authPort = new AuthPort();
export default authPort;
