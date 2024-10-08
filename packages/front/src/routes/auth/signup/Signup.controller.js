import { SignupErrorCodes } from "dto";
import { getContext } from "svelte";
import { PUBLIC_PRIVACY_POLICY_URL, PUBLIC_CGU_URL } from "$env/static/public";
import Store from "$lib/core/Store";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service";

export default class SignupController {
    ERROR_MESSAGES = {
        [SignupErrorCodes.EMAIL_NOT_VALID]: "L'adresse mail fournie ne semble pas être une adresse valide.",
        [SignupErrorCodes.CREATION_ERROR]: `Une erreur est survenue lors de la création de votre compte. Ré-essayez plus tard ou <a href="/contact" target="_blank" rel="noopener noreferrer" title="Contactez-nous - nouvelle fenêtre">contactez-nous</a>`,
        [SignupErrorCodes.CREATION_RESET_ERROR]: `Une erreur est survenue lors de la création de votre compte. Ré-essayez plus tard ou <a href="/contact" target="_blank" rel="noopener noreferrer" title="Contactez-nous - nouvelle fenêtre">contactez-nous</a>`,
        [SignupErrorCodes.EMAIL_MUST_BE_END_GOUV]: `Le domaine de votre adresse e-mail n'est pas reconnu. Merci de nous adresser un e-mail à <a href="/contact" target="_blank" rel="noopener noreferrer" title="Contactez-nous - nouvelle fenêtre">contact@datasubvention.beta.gouv.fr</a> pour y remédier.`,
    };

    WORK_ETHIC_OPTIONS = [
        {
            label: `J'ai bien conscience que tout usage personnel sans objet avec mes missions professionnelles est proscrit conformément aux <a href="${PUBLIC_CGU_URL}" target="_blank">conditions générales d’utilisation</a> du site.`,
            value: "true",
            withHtml: true,
        },
    ];

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
        this.acceptWorkEthic = new Store([]);
        this.workEthicError = new Store("");
    }

    get privacyPolicyUrl() {
        return PUBLIC_PRIVACY_POLICY_URL;
    }

    get cguUrl() {
        return PUBLIC_CGU_URL;
    }

    signup() {
        this.firstSubmitted.set(true);
        if (!this.checkWorkEthic()) return;
        // TODO: check what format the new API create user is waiting for
        this.signupPromise.set(authService.signup(this.signupUser.value).finally(() => this._showAlert()));
    }

    signin() {
        goToUrl("/auth/login");
    }

    getErrorMessage(error) {
        return this.ERROR_MESSAGES[error] || "Une erreur est survenue lors de la création de votre compte.";
    }

    get contactEmail() {
        return this.app.getContact();
    }

    checkWorkEthic() {
        if (this.acceptWorkEthic.value[0] !== "true") {
            this.workEthicError.set("Champ obligatoire");
            return false;
        }
        this.workEthicError.set("");
        return true;
    }

    // what follows manages scroll to show alert

    _showAlert() {
        if (this.alertElement) this.alertElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    onMount(alertElement) {
        this.alertElement = alertElement;
    }
}
