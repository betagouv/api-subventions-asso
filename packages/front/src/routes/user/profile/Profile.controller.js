import Store from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";

export class ProfileController {
    constructor() {
        this.error = new Store(false);
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
