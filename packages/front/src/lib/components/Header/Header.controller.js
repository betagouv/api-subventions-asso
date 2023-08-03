import { goToUrl } from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";

export default class HeaderController {
    logout() {
        authService.logout();
        goToUrl("/auth/login");
    }

    goToProfile() {
        goToUrl("/user/profile");
    }
}
