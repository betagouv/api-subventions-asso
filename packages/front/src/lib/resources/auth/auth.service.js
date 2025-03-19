import { SignupErrorCodes, ResetPasswordErrorCodes } from "dto";
import authPort from "$lib/resources/auth/auth.port";
import { goToUrl } from "$lib/services/router.service";
import crispService from "$lib/services/crisp.service";
import AuthLevels from "$lib/resources/auth/authLevels";
import { checkOrDropSearchHistory } from "$lib/services/searchHistory.service";
import userService from "$lib/resources/users/user.service";
import localStorageService from "$lib/services/localStorage.service";
import { connectedUser } from "$lib/store/user.store";
import { PUBLIC_AGENT_CONNECT_ENABLED } from "$env/static/public";

export class AuthService {
    constructor() {
        this.connectedUser = connectedUser;
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

    async loginAgentConnect(rawSearchQueries) {
        const user = await authPort.loginAgentConnect(rawSearchQueries);
        return this.loginByUser(user);
    }

    loginByUser(user) {
        checkOrDropSearchHistory(user._id);
        localStorageService.removeItem("hide-main-info-banner");
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

    async logout() {
        const { url, _success } = await authPort.logout();
        this.connectedUser.set(null);
        crispService.resetSession();
        if (PUBLIC_AGENT_CONNECT_ENABLED && url) return goToUrl(url);
        return goToUrl("/auth/login", false);
    }

    getCurrentUser() {
        return this.connectedUser.value;
    }

    getCurrentUserStore() {
        return this.connectedUser;
    }
    controlAuth(requiredLevel = AuthLevels.USER) {
        if (requiredLevel === AuthLevels.NONE) return true;
        const user = this.getCurrentUser();
        if (!user) {
            this.redirectToLogin();
            return false;
        } else if (requiredLevel === AuthLevels.ADMIN && !this._isAdmin(user)) {
            goToUrl("/");
            return false;
        }
        return true;
    }

    _isAdmin(user) {
        return user?.roles?.includes("admin");
    }

    redirectToLogin() {
        localStorageService.setItem("redirectUrl", { url: location.pathname, setDate: new Date() });
        return goToUrl("/auth/login");
    }

    redirectAfterProConnectLogin(updatedUser) {
        this.setUserInApp(updatedUser);
        return this.redirectAfterLogin();
    }

    redirectAfterLogin() {
        const redirection = localStorageService.getItem("redirectUrl", null).value;
        // if connect with proconnect and incomplete profil - redirection to form
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.agentConnectId && currentUser.profileToComplete) {
            return goToUrl("/auth/signup-ac");
        }
        if (!redirection) return goToUrl("/");
        localStorageService.removeItem("redirectUrl");
        const { url, setDate } = redirection;
        const soonBefore = new Date();
        soonBefore.setHours(soonBefore.getHours() - 1);

        if (new Date(setDate) < soonBefore) return goToUrl("/", true, true);
        return goToUrl(url);
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
