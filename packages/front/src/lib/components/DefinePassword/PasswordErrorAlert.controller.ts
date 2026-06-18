const ERROR_MESSAGES = {
    400: "Le format du mot de passe ne correspond pas aux exigences de sécurité",
    404: `<p>Ce lien n'est pas valide, vérifiez que l'URL est bien celle envoyée par mail.</p>
        <p>Il est possible que votre lien a expiré, allez sur <a href="/auth/forget-password" target="_blank" rel="noopener noreferrer" title="mot de passe oublié - nouvelle fenêtre">la page mot de passe oublié</a> pour recevoir un nouveau lien d'activation.</p>`,
    410: `Le lien a expiré, allez sur <a href="/auth/forget-password" target="_blank" rel="noopener noreferrer" title="mot de passe oublié - nouvelle fenêtre">la page mot de passe oublié</a> pour recevoir un nouveau lien d'activation.`,
};

const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue lors de la création de votre compte.";

export default class PasswordErrorAlertController {
    constructor(public error) {}

    get errorMessage() {
        return ERROR_MESSAGES[this.error.httpCode] || DEFAULT_ERROR_MESSAGE;
    }
}
