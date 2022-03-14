import apiDatasubService from "../../shared/apiDatasub.service";

export class AuthService {

    async login(email: string, password: string): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR", data?: unknown }> {
        try {
            const result = await apiDatasubService.login(email as string, password);
            return { type: "SUCCESS", data: result.data };
        } catch (e) {
            return { type: "ERROR" }
        }
    }

    async resetPassword(token: string, password: string): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR", data?: unknown }> {
        try {
            const result = await apiDatasubService.resetPassword(token, password);
            return { type: "SUCCESS", data: result.data };
        } catch (e) {
            return { type: "ERROR" }
        }
    }

    async forgetPassword(email: string): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR", data?: unknown }> {
        try {
            const result = await apiDatasubService.forgetPassword(email);
            return { type: "SUCCESS", data: result.data };
        } catch (e) {
            return { type: "ERROR" }
        }
    }
}

const authService = new AuthService();

export default authService;