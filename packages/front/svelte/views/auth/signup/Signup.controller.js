import { SignupErrorCodes } from "@api-subventions-asso/dto";
import { getContext } from "svelte";
import { PRIVACY_POLICY_URL } from "../../../../src/shared/config";
import Store from "@core/Store";
import authService from "@resources/auth/auth.service";
import { goToUrl } from "@services/router.service";

export default class SignupController {
    ERROR_MESSAGES = {
        [SignupErrorCodes.EMAIL_NOT_VALID]: "L'adresse mail fournie ne semble pas être une adresse valide.",
        [SignupErrorCodes.CREATION_ERROR]: `Une erreur est survenue lors de la création de votre compte. Ré-essayez plus tard ou <a href="/contact" target="_blank" rel="noopener noreferrer">contactez-nous</a>`,
        [SignupErrorCodes.CREATION_RESET_ERROR]: `Une erreur est survenue lors de la création de votre compte. Ré-essayez plus tard ou <a href="/contact" target="_blank" rel="noopener noreferrer">contactez-nous</a>`,
        [SignupErrorCodes.EMAIL_MUST_BE_END_GOUV]: `Le domaine de votre adresse e-mail n'est pas reconnu. Merci de nous adresser un e-mail à <a href="/contact" target="_blank" rel="noopener noreferrer">contact@datasubvention.beta.gouv.fr</a> pour y remédier.`,
    };

    constructor() {
        this.app = getContext("app");
        this.pageTitle = `Créer votre compte sur ${this.app.getName()}`;
        this.signupUser = new Store({
            lastname: null,
            firstname: null,
            email: null,
        });
        this.signupPromise = new Store(Promise.resolve());
        this.firstSubmitted = new Store(false);
    }

    get privacyPolicyUrl() {
        return PRIVACY_POLICY_URL;
    }

    signup() {
        // TODO: check what format the new API create user is waiting for
        this.signupPromise.set(authService.signup(this.signupUser.value));
        this.firstSubmitted.set(true);
    }

    signin() {
        goToUrl("/auth/login");
    }

    getErrorMessage(code) {
        return this.ERROR_MESSAGES[code] || "Une erreur est survenue lors de la création de votre compte.";
    }

    get contactEmail() {
        return this.app.getContact();
    }
}
