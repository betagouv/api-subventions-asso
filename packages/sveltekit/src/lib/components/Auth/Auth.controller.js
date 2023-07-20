import authService from "$lib/resources/auth/auth.service";

export default class AuthController {
    init() {
        authService.initUserInApp();
    }
}
