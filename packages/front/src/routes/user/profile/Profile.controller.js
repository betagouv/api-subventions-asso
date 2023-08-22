import Store from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";
import { goToUrl } from "$lib/services/router.service";

export class ProfileController {
    constructor() {
        this.error = new Store(false);
    }

    async deleteUser() {
        try {
            this.error.set(false);
            await userService.deleteCurrentUser();
            goToUrl("/auth/signup", false);
        } catch (e) {
            this.error.set(true);
        }
    }
}
