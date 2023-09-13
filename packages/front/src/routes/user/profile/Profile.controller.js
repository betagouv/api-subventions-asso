import Store from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";

export class ProfileController {
    constructor() {
        this.deleteError = new Store(false);
        this.user = new Store({});
    }

    init() {
        this.user.set({ firstname: "Lucile", lastname: "DUPOND", email: "name@mail.gouv.fr" }); // TODO get infos about user
    }

    onSubmit() {
        // TODO call to update
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
