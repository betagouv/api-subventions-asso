import Store from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";

export class ProfileController {
    constructor() {
        this.error = new Store(false);
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
            this.error.set(false);
            userService.deleteCurrentUser();
        } catch (e) {
            this.error.set(true);
        }
    }
}
