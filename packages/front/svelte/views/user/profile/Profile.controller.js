import Store from "@core/Store";
import authService from "@resources/auth/auth.service";
import userService from "@resources/users/user.service";
import { goToUrl } from "@services/router.service";

export class ProfileController {
    constructor() {
        this.error = new Store(false);
    }

    logout() {
        authService.logout();
        goToUrl("/auth/login");
    }

    async deleteUser() {
        try {
            this.error.set(false);
            await userService.deleteCurrentUser();
            this.logout();
        } catch (e) {
            this.error.set(true);
        }
    }
}
