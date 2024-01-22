import { goToUrl } from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";

export default class HeaderController {
    async logout() {
        await authService.logout();
        return goToUrl("/auth/login");
    }

    goToProfile() {
        goToUrl("/user/profile");
    }
}
