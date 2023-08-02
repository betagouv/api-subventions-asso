import authService from "$lib/resources/auth/auth.service";
import { page } from "$app/stores";

export default class AuthController {
    init() {
        authService.initUserInApp();
        page.subscribe(newPage => {
            authService.controlAuth(newPage?.data?.authLevel);
        });
    }
}