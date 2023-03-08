import axios from "axios";
import { SignupErrorCodes, ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import routes from "../../routes";
import authPort from "@resources/auth/auth.port";
import * as RouterService from "@services/router.service";
import { goToUrl } from "@services/router.service";

export class AuthService {
    USER_LOCAL_STORAGE_KEY = "datasubvention-user";

    signup(email) {
        if (!email) return Promise.reject(SignupErrorCodes.EMAIL_NOT_VALID);
        return authPort
            .signup(email)
            .then(data => data)
            .catch(error => Promise.reject(parseInt(error.message)));
    }

    resetPassword(token, password) {
        if (!token) return Promise.reject(ResetPasswordErrorCodes.INTERNAL_ERROR);
        return authPort
            .resetPassword(token, password)
            .then(data => data)
            .catch(error => Promise.reject(parseInt(error.message)));
    }

    forgetPassword(email) {
        if (!email) return Promise.reject();
        return authPort.forgetPassword(email).then(data => data);
    }

    async login(email, password) {
        const user = await authPort.login(email, password);
        localStorage.setItem(this.USER_LOCAL_STORAGE_KEY, JSON.stringify(user));

        return user;
    }

    initUserInApp() {
        const user = this.getCurrentUser();
        // set header token for each requests
        axios.defaults.headers.common["x-access-token"] = user?.jwt?.token;

        axios.interceptors.response.use(
            response => response,
            error => {
                const current = RouterService.getRoute(routes, location.pathname);
                if (error.isAxiosError && error.response.status === 401 && !current.disableAuth) {
                    this.logout();
                    goToUrl("/auth/login");
                }
                // Do something with response error
                return Promise.reject(error);
            }
        );
    }

    logout() {
        localStorage.removeItem(this.USER_LOCAL_STORAGE_KEY);
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.USER_LOCAL_STORAGE_KEY));
    }
}

const authService = new AuthService();

export default authService;
