import { AgentTypeEnum } from "dto";
import Store, { derived } from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";

export class ProfileController {
    agentTypeOptions = subscriptionFormService.agentTypeOptions;

    constructor() {
        this.deleteError = new Store(false);
        this.user = new Store({});
        this.saveStatus = new Store(""); // "changed", "saved" or "error"
        this.saveValidation = new Store(true);
        this.isSubmitBlocked = derived(
            [this.saveStatus, this.saveValidation],
            ([status, validation]) => (status !== "changed" && status !== "error") || !validation,
        );
        // beforeNavigate(() => {})
    }

    onMount(saveAlertElement) {
        this.saveAlertElement = saveAlertElement;
    }

    onChange() {
        this.saveStatus.set("changed");
    }

    init() {
        this.user.set({
            firstname: "Lucile",
            lastname: "DUPOND",
            email: "name@mail.gouv.fr",
            service: "some service",
            agentType: AgentTypeEnum.OPERATOR,
        }); // TODO get infos about user
    }

    showAlert() {
        if (this.saveAlertElement) this.saveAlertElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    onSubmit() {
        try {
            // TODO call to update
            this.saveStatus.set("saved");
        } catch (_e) {
            this.saveStatus.set("error");
        }
        this.showAlert();
    }

    updateValidation(isValid) {
        this.saveValidation.set(isValid);
    }

    deleteUser() {
        try {
            this.deleteError.set(false);
            return userService.deleteCurrentUser();
        } catch (e) {
            this.deleteError.set(true);
        }
    }
}
