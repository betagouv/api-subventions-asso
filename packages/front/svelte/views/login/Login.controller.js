import authService from "@resources/auth/auth.service";
import { Store } from "express-session";
// import { LoginDtoErrorCodes } from "@api-subventions-asso/dto";

export default class LoginController {
    constructor() {
        this.formElt = null;
        this.error = new Store(null);
    }

    async submit(e) {
        e.preventDefault();
        if (!this.formElt) return;
        const { email, password } = Object.fromEntries(new FormData(this.formElt).entries());

        try {
            const result = await authService.login(email, password);
            console.log(result);
        } catch (e) {
            const message = this._getErrorMessage(e.data?.code);

            this.error.set(message);
        }
    }

    _getErrorMessage(code) {
        // if (code === LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH) {
        return "Mot de passe ou email incorrect";
        // }

        // if (code === LoginDtoErrorCodes.USER_NOT_ACTIVE) {
        return "Votre compte ne semble pas encore activé, si vous ne retrouvez pas votre mail d'activation vous pouvez faire mot de passe oublié.";
        // }

        return "Une erreur interne est survenue, veuillez réessayer plus tard.";
    }
}
