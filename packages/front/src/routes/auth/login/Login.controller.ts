import { goToUrl } from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";
import Store from "$lib/core/Store";
import type HttpError from "$lib/errors/HttpError";

export default class LoginController {
    email: string | null = null;
    password: string | null = null;
    _query: Record<string, unknown>;
    error: Store<string | null> = new Store(null);
    showSuccessMessage: boolean;
    successMessage: string;
    pageTitle: string = `Accéder à Data.Subvention`;
    forgetPasswordUrl: string = "/auth/forget-password";
    alertElement: HTMLElement | null = null;

    constructor(query) {
        this._query = query;
        this.showSuccessMessage = !!query.success;
        this.successMessage = this._getSuccessMessage();
        if (query.code) this._proceedWithAgentConnect(window.location.search);
    }

    signup() {
        goToUrl("/auth/signup");
    }

    async submit() {
        try {
            await authService.login(this.email, this.password);
            return authService.redirectAfterLogin();
        } catch (error) {
            const message = this._getErrorMessage((error as HttpError).httpCode);
            this.error.set(message);
        }
        this._showAlert();
    }

    async _proceedWithAgentConnect(rawStringQuery) {
        try {
            await authService.loginAgentConnect(rawStringQuery);
            return authService.redirectAfterLogin();
        } catch (error) {
            const message = this._getErrorMessage((error as HttpError).httpCode);
            this.error.set(message);
        }
    }

    _getErrorMessage(httpCode) {
        if (httpCode === 401) {
            return "Mot de passe ou email incorrect";
        }

        if (httpCode === 403) {
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
