import { SignupErrorCodes, ResetPasswordErrorCodes } from "dto";
import { UnauthorizedError } from "../../errors";
import authPort from "$lib/resources/auth/auth.port";
import requestsService from "$lib/services/requests.service";
import { goToUrl } from "$lib/services/router.service";
import crispService from "$lib/services/crisp.service";
import { page } from "$lib/store/kit.store";
import localStorageService from "$lib/services/localStorage.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import { isAdmin } from "$lib/services/user.service";
import { checkOrDropSearchHistory } from "$lib/services/searchHistory.service";

export class AuthService {
    USER_LOCAL_STORAGE_KEY = "datasubvention-user";

    signup(signupUser) {
        if (!signupUser?.email) return Promise.reject(SignupErrorCodes.EMAIL_NOT_VALID);
        return authPort.signup(signupUser);
    }

    resetPassword(token, password) {
        if (!token) return Promise.reject(ResetPasswordErrorCodes.INTERNAL_ERROR);
        return authPort.resetPassword(token, password).then(user => this.loginByUser(user));
    }

    forgetPassword(email) {
        if (!email) return Promise.reject();
        return authPort.forgetPassword(email).then(data => data);
    }

    async login(email, password) {
        const user = await authPort.login(email, password);
        return this.loginByUser(user);
    }

    loginByUser(user) {
        checkOrDropSearchHistory(user._id);
        localStorageService.setItem(this.USER_LOCAL_STORAGE_KEY, user);
        this.setUserInApp();
        crispService.setUserEmail(user.email);

        return user;
    }

    setUserInApp() {
        const user = this.getCurrentUser();
        if (user) crispService.setUserEmail(user.email);
    }

    initUserInApp() {
        this.setUserInApp();
        requestsService.addErrorHook(UnauthorizedError, error => {
            // if the unauthorized error is triggered from a login error, we do not redirect/reload to the /auth/login page
            if (error.__nativeError__.request.responseURL.includes("/auth/login")) return;
            const queryUrl = encodeURIComponent(page.value.url.pathname);
            this.logout(false);
            goToUrl(`/auth/login?url=${queryUrl}`, true, true);
        });
    }

    logout(reload = true) {
        localStorageService.removeItem(this.USER_LOCAL_STORAGE_KEY);
        crispService.resetSession();
        if (reload) goToUrl("/auth/login", false, true);
    }

    getCurrentUser() {
        return localStorageService.getItem(this.USER_LOCAL_STORAGE_KEY).value;
    }

    controlAuth(requiredLevel = AuthLevels.USER) {
        if (requiredLevel === AuthLevels.NONE) return;
        const user = this.getCurrentUser();
        if (!user) return this.redirectToLogin();
        if (requiredLevel === AuthLevels.ADMIN && !isAdmin(user)) goToUrl("/");
    }

    redirectToLogin() {
        const queryUrl = encodeURIComponent(location.pathname);
        return goToUrl(`/auth/login?url=${queryUrl}`);
    }

    validateToken(token) {
        return authPort.validateToken(token);
    }

    activate(token, data) {
        return authPort.activate(token, data).then(user => this.loginByUser(user));
    }
}

const authService = new AuthService();

export default authService;
