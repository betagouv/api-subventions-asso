import authService from "@resources/auth/auth.service";

export default class AuthController {
    init() {
        authService.initUserInApp();
    }
}
