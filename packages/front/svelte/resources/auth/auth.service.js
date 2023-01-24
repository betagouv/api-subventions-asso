// TODO update import after switch svelte to ts #330
import { SignupErrorCodes } from "@api-subventions-asso/dto/build/auth/SignupDtoResponse";
import authPort from "@resources/auth/auth.port";

export class AuthService {
    signup(email) {
        if (!email) return Promise.reject(SignupErrorCodes.EMAIL_NOT_VALID);
        return authPort.signup(email);
    }
}

const authService = new AuthService();

export default authService;
