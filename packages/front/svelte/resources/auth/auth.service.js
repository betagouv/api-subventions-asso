// TODO update import after switch svelte to ts #330
import { SignupErrorCodes } from "@api-subventions-asso/dto/build/auth/SignupDtoResponse";
import authPort from "@resources/auth/auth.port";

export class AuthService {
    async signup(email) {
        if (!email) return SignupErrorCodes.EMAIL_NOT_VALID;
        return await authPort.signup(email);
    }
}

const authService = new AuthService();

export default authService;
