import { SignupErrorCodes, ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import routes from "../../routes";
import { UnauthorizedError } from "../../errors";
import authPort from "@resources/auth/auth.port";
import * as RouterService from "@services/router.service";
import requestsService from "@services/requests.service";
import { goToUrl } from "@services/router.service";
import crispService from "@services/crisp.service";

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
        crispService.setUserEmail(user.email);

        return user;
    }

    initUserInApp() {
        const user = this.getCurrentUser();

        requestsService.initAuthentication(user?.jwt?.token);
        if (user) crispService.setUserEmail(user.email);

        requestsService.addErrorHook(UnauthorizedError, () => {
            const current = RouterService.getRoute(routes, location.pathname);
            if (current.disableAuth) return;

            this.logout();
            goToUrl("/auth/login");
        });
    }

    logout() {
        localStorage.removeItem(this.USER_LOCAL_STORAGE_KEY);
        crispService.resetSession();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.USER_LOCAL_STORAGE_KEY));
    }
}

const authService = new AuthService();

export default authService;
