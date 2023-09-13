import Store from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";

export class ProfileController {
    constructor() {
        this.deleteError = new Store(false);
        this.user = new Store({});
        this.saveStatus = new Store(""); // "changed", "saved" or "error"
    }

    onMount(saveAlertElement) {
        this.saveAlertElement = saveAlertElement;
    }

    genOnChange() {
        let firstDone = false;
        return () => {
            if (!firstDone) return (firstDone = true);
            this.saveStatus.set("changed");
        };
    }

    init() {
        this.user.set({ firstname: "Lucile", lastname: "DUPOND", email: "name@mail.gouv.fr" }); // TODO get infos about user
        this.user.subscribe(this.genOnChange());
    }

    onSubmit() {
        try {
            // TODO call to update
            this.saveStatus.set("saved");
        } catch (_e) {
            this.saveStatus.set("error");
        }
        if (this.saveAlertElement) this.saveAlertElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
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
