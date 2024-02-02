import { goToUrl } from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";

export default class HeaderController {
    async logout() {
        return authService.logout();
    }

    goToProfile() {
        return goToUrl("/user/profile");
    }
}
