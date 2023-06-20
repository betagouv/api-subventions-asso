import authService from "@resources/auth/auth.service";
import { goToUrl } from "@services/router.service";

export class ProfileController {
    logout() {
        authService.logout();
        goToUrl("/auth/login");
    }

    deleteUser() {
        // add remove here when ready
        this.logout();
    }
}
