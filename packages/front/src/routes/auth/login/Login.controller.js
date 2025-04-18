import { LoginDtoErrorCodes } from "dto";
import { goToUrl } from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";
import Store from "$lib/core/Store";

export default class LoginController {
    constructor(query) {
        this.email = null;
        this.password = null;
        this._query = query;
        this.error = new Store(null);
        this.showSuccessMessage = !!query.success;
        this.successMessage = this._getSuccessMessage();
        this.pageTitle = `Accéder à Data.Subvention`;
        this.forgetPasswordUrl = "/auth/forget-password";
        if (query.code) this._proceedWithAgentConnect(window.location.search);
    }

    signup() {
        goToUrl("/auth/signup");
    }

    async submit() {
        try {
            await authService.login(this.email, this.password);
            return authService.redirectAfterLogin();
        } catch (e) {
            const message = this._getErrorMessage(e.data?.code);
            this.error.set(message);
        }
        this._showAlert();
    }

    async _proceedWithAgentConnect(rawStringQuery) {
        try {
            await authService.loginAgentConnect(rawStringQuery);
            return authService.redirectAfterLogin();
        } catch (e) {
            const message = this._getErrorMessage(e.data?.code);
            this.error.set(message);
        }
    }

    _getErrorMessage(code) {
        if (code === LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH) {
            return "Mot de passe ou email incorrect";
        }

        if (code === LoginDtoErrorCodes.USER_NOT_ACTIVE) {
            return "Votre compte ne semble pas encore activé, si vous ne retrouvez pas votre mail d'activation vous pouvez faire mot de passe oublié.";
        }

        return "Une erreur interne est survenue, veuillez réessayer plus tard.";
    }

    _getSuccessMessage() {
        return this._query.success === "ACCOUNT_ACTIVATED"
            ? "Votre compte a bien été activé, vous pouvez maintenant vous connecter"
            : "Votre mot de passe a bien été changé";
    }

    _showAlert() {
        if (this.alertElement) this.alertElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    onMount(alertElement) {
        this.alertElement = alertElement;
    }
}
