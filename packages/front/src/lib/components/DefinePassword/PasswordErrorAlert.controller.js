import { ResetPasswordErrorCodes } from "dto";

const ERROR_MESSAGES = {
    [ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND]: `<p>Ce lien n'est pas valide, vérifiez que l'URL est bien celle envoyée par mail.</p>
        <p>Il est possible que votre lien a expiré, allez sur <a href="/auth/forget-password" target="_blank" rel="noopener noreferrer" title="mot de passe oublié - nouvelle fenêtre">la page mot de passe oublié</a> pour recevoir un nouveau lien d'activation.</p>`,
    [ResetPasswordErrorCodes.USER_NOT_FOUND]:
        "Ce lien n'est pas valide, vérifiez que l'URL est bien celle envoyée par mail.",
    [ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED]: `Le lien a expiré, allez sur <a href="/auth/forget-password" target="_blank" rel="noopener noreferrer" title="mot de passe oublié - nouvelle fenêtre">la page mot de passe oublié</a> pour recevoir un nouveau lien d'activation.`,
    [ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID]:
        "Le format du mot de passe ne correspond pas aux exigences de sécurité",
};

const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue lors de la création de votre compte.";

export default class PasswordErrorAlertController {
    constructor(error) {
        this.error = error;
    }

    get errorMessage() {
        return ERROR_MESSAGES[this.error.data.code] || DEFAULT_ERROR_MESSAGE;
    }
}
