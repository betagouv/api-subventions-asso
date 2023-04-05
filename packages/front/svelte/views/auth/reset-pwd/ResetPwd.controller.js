import { ResetPasswordErrorCodes } from "@api-subventions-asso/dto";
import Store from "@core/Store";
import authService from "@resources/auth/auth.service";

export class ResetPwdController {
    PWD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!#@$%^&(){}[\]:;<>,.?/~_+=|-]).{8,32}$/;
    ERROR_MESSAGES = {
        [ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND]:
            "Ce lien n'est pas valide, vérifiez que l'URL est bien celle envoyée par mail.",
        [ResetPasswordErrorCodes.USER_NOT_FOUND]:
            "Ce lien n'est pas valide, vérifiez que l'URL est bien celle envoyée par mail.",
        [ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED]: `Le lien a expiré, allez sur <a href="/auth/forget-password" target="_blank" rel="noopener noreferrer">la page mot de passe oublié</a> pour recevoir un nouveau lien d'activation.`,
        [ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID]:
            "Le format du mot de passe ne correspond pas aux exigences de sécurité",
    };
    DEFAULT_ERROR_MESSAGE = "Une erreur est survenue lors de la création de votre compte.";

    constructor(token) {
        this.token = token;
        const urlParams = new URLSearchParams(window.location.search);
        this.activation = urlParams.get("active");
        this.title = this.activation ? "Activer mon compte en créant mon mot de passe" : "Modifier votre mot de passe";

        this.promise = new Store(
            token ? Promise.resolve() : Promise.reject(ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND),
        );
        this.password = new Store("");
    }

    getErrorMessage(code) {
        return this.ERROR_MESSAGES[code] || this.DEFAULT_ERROR_MESSAGE;
    }

    onSubmit() {
        this.promise.set(authService.resetPassword(this.token, this.password.value));
        return this.promise.value
            .then(() => {
                window.location.assign(
                    "/auth/login?success=" + (this.activation ? "ACCOUNT_ACTIVATED" : "PASSWORD_CHANGED"),
                );
            })
            .catch((_, ignore) => ignore());
    }

    checkPassword(password) {
        return this.PWD_REGEX.test(password);
    }
}
