import { SignupErrorCodes, ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import { get } from "svelte/store";
import { UnauthorizedError } from "../../errors";
import authPort from "$lib/resources/auth/auth.port";
import requestsService from "$lib/services/requests.service";
import { goToUrl } from "$lib/services/router.service";
import crispService from "$lib/services/crisp.service";
import { page } from "$app/stores";
import localStorageStore from "$lib/store/localStorage";
import AuthLevels from "$lib/resources/auth/authLevels";
import { isAdmin } from "$lib/services/user.service.js";

export class AuthService {
    USER_LOCAL_STORAGE_KEY = "datasubvention-user";

    signup(signupUser) {
        if (!signupUser?.email) return Promise.reject(SignupErrorCodes.EMAIL_NOT_VALID);
        return authPort.signup(signupUser);
    }

    resetPassword(token, password) {
        if (!token) return Promise.reject(ResetPasswordErrorCodes.INTERNAL_ERROR);
        return authPort.resetPassword(token, password);
    }

    forgetPassword(email) {
        if (!email) return Promise.reject();
        return authPort.forgetPassword(email).then(data => data);
    }

    async login(email, password) {
        const user = await authPort.login(email, password);
        localStorageStore.setItem(this.USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
        this.setUserInApp();
        crispService.setUserEmail(user.email);

        return user;
    }

    setUserInApp() {
        const user = this.getCurrentUser();
        requestsService.initAuthentication(user?.jwt?.token);
        if (user) crispService.setUserEmail(user.email);
    }

    initUserInApp() {
        this.setUserInApp();
        requestsService.addErrorHook(UnauthorizedError, () => {
            const queryUrl = encodeURIComponent(get(page).url.pathname);
            this.logout(false);
            goToUrl(`/auth/login?url=${queryUrl}`, true, true);
        });
    }

    logout(reload = true) {
        localStorageStore.removeItem(this.USER_LOCAL_STORAGE_KEY);
        crispService.resetSession();
        if (reload) goToUrl("/auth/login", false, true);
    }

    getCurrentUser() {
        return JSON.parse(get(localStorageStore.getItem(this.USER_LOCAL_STORAGE_KEY)) || null);
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
}

const authService = new AuthService();

export default authService;
