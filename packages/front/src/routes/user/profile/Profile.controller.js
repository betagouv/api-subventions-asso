import QuitNoSaveModal from "./components/QuitNoSaveModal.svelte";
import Store, { derived } from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";
import { beforeNavigate, goto } from "$app/navigation";
import { action, modal } from "$lib/store/modal.store";
import localStorageService from "$lib/services/localStorage.service";

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

        beforeNavigate(({ cancel, willUnload, to }) => {
            if (this.saveStatus.value === "changed" && !this.confirmingLeave && !willUnload) {
                cancel();
                this.modalCtrlButton.click();
                modal.set(QuitNoSaveModal);
                action.set(() => goto(to.url));
            }
        });
    }

    get confirmingLeave() {
        return this.modalCtrlButton.getAttribute("data-fr-opened") === "true";
    }

    onMount(saveAlertElement, modalCtrlButton) {
        this.saveAlertElement = saveAlertElement;
        this.modalCtrlButton = modalCtrlButton;
    }

    onChange() {
        this.saveStatus.set("changed");
    }

    async init() {
        this.user.set(await userService.getSelfUser());
        this.isAgentConnectUser = !!this.user.value.agentConnectId;
    }

    showAlert() {
        if (this.saveAlertElement) this.saveAlertElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    async onSubmit(data) {
        try {
            await userService.updateProfile(data);
            // if (userService.isProfileFullyCompleted(data)) {  // TODO clean in #2544
            //     localStorageService.setItem("hide-main-info-banner", true);
            // }
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
