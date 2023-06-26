import { goToUrl } from "@services/router.service";
import authService from "@resources/auth/auth.service";

export default class HeaderController {
    logout() {
        authService.logout();
        goToUrl("/auth/login");
    }

    goToProfile() {
        goToUrl("/user/profile");
    }
}
