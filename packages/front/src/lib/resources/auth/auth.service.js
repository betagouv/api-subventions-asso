import { SignupErrorCodes, ResetPasswordErrorCodes } from "dto";
import authPort from "$lib/resources/auth/auth.port";
import { goToUrl } from "$lib/services/router.service";
import crispService from "$lib/services/crisp.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import { isAdmin } from "$lib/services/user.service";
import { checkOrDropSearchHistory } from "$lib/services/searchHistory.service";
import userService from "$lib/resources/users/user.service";
import Store from "$lib/core/Store";

export class AuthService {
    constructor() {
        this.connectedUser = new Store(null);
    }

    signup(signupUser) {
        if (!signupUser?.email) {
            if (!signupUser?.email) return Promise.reject(SignupErrorCodes.EMAIL_NOT_VALID);
        }
        return authPort.signup(signupUser).catch(error => Promise.reject(error.data.code));
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
        this.setUserInApp(user);
        crispService.setUserEmail(user.email);

        return user;
    }

    setUserInApp(user) {
        if (!user) return;
        this.connectedUser.set(user);
        if (user) crispService.setUserEmail(user.email);
    }

    async initUserInApp() {
        if (this.connectedUser.value) return true;
        try {
            const user = await userService.getSelfUser();
            this.setUserInApp(user);
            return true;
        } catch (_e) {
            console.info("user not connected");
            return false;
        }
    }

    async logout(reload = true) {
        await authPort.logout();
        this.connectedUser.set(null);
        crispService.resetSession();
        if (reload) goToUrl("/auth/login", false, true);
    }

    getCurrentUser() {
        return this.connectedUser.value;
    }

    controlAuth(requiredLevel = AuthLevels.USER) {
        if (requiredLevel === AuthLevels.NONE) return true;
        const user = this.getCurrentUser();
        if (!user) {
            this.redirectToLogin();
            return false;
        } else if (requiredLevel === AuthLevels.ADMIN && !isAdmin(user)) {
            goToUrl("/");
            return false;
        }
        return true;
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
