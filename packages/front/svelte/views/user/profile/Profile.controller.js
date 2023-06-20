import authService from "@resources/auth/auth.service";
import userService from "@resources/users/user.service";
import { goToUrl } from "@services/router.service";

export class ProfileController {
    logout() {
        authService.logout();
        goToUrl("/auth/login");
    }

    deleteUser() {
        userService.deleteCurrentUser();
        this.logout();
    }
}
