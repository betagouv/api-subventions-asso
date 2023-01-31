import authService from "@resources/auth/auth.service";
import { goToUrl } from "@services/router.service";

export default class HeaderController {
    logout() {
        authService.logout();
        goToUrl("/auth/login");
    }
}
