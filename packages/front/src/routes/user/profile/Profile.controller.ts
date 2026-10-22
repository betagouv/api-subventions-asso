import QuitNoSaveModal from "./components/QuitNoSaveModal.svelte";
import Store, { derived, ReadStore } from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionForm.service";
import { beforeNavigate, goto } from "$app/navigation";
import { action, modal } from "$lib/store/modal.store";
import type { UserDto } from "dto";
// import localStorageService from "$lib/services/localStorage.service";

export class ProfileController {
    agentTypeOptions = subscriptionFormService.agentTypeOptions;

    isLeaveConfirmed = false;
    deleteError = new Store(false);
    user: Store<UserDto | null> = new Store(null);
    saveStatus = new Store(""); // "changed", "saved" or "error"
    saveValidation = new Store(true);
    isSubmitBlocked: ReadStore<boolean>;
    modalCtrlButton: HTMLButtonElement | null = null;
    saveAlertElement: HTMLElement | null = null;
    isAgentConnectUser: boolean = false;

    constructor() {
        this.isSubmitBlocked = derived(
            [this.saveStatus, this.saveValidation],
            ([status, validation]) => (status !== "changed" && status !== "error") || !validation,
        );

        beforeNavigate(({ cancel, willUnload, to }) => {
            if (!this.modalCtrlButton) throw new Error("modalCtrlButton is not defined");
            if (this.saveStatus.value === "changed" && !this.isLeaveConfirmed && !willUnload) {
                cancel();
                this.modalCtrlButton.click();
                modal.set(QuitNoSaveModal);
                action.set(() => {
                    this.isLeaveConfirmed = true;
                    if (to) return goto(to.url);
                    else goto("/");
                });
            }
        });
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
        this.isAgentConnectUser = !!this.user.value!.proConnectId;
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
        } catch {
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
        } catch {
            this.deleteError.set(true);
        }
    }
}
