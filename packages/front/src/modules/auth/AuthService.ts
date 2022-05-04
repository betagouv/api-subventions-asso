import { ResetPasswordDtoNegativeResponse, ResetPasswordErrorCodes, SignupDtoNegativeResponse, SignupErrorCodes } from "@api-subventions-asso/dto";
import axios, { AxiosError } from "axios";
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

    async resetPassword(token: string, password: string): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR", data?: unknown, code?: ResetPasswordErrorCodes }> {
        try {
            const result = await apiDatasubService.resetPassword(token, password);

            if (result.data.success) {
                return { type: "SUCCESS", data: result.data.data.user };
            }

            return {
                type: "ERROR",
                code: result.data.data.code
            }

        } catch (e) {
            if (axios.isAxiosError(e)) {
                return { type: "ERROR", code: (e as AxiosError<ResetPasswordDtoNegativeResponse>).response?.data.data.code }
            }
            return { type: "ERROR", code: ResetPasswordErrorCodes.INTERNAL_ERROR }
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

    async signup(email: string): Promise<{ type: "ERROR" | "SUCCESS", code?: SignupErrorCodes}> {
        try {
            const result = await apiDatasubService.signup(email);

            if (result.data.success) {
                return { type: "SUCCESS" };
            }
            return { type: "ERROR", code: result.data.data.errorCode }

        } catch(e: unknown) {
            if (axios.isAxiosError(e)) {
                return { type: "ERROR", code: (e as AxiosError<SignupDtoNegativeResponse>).response?.data.data.errorCode }
            }
            return { type: "ERROR", code: SignupErrorCodes.CREATION_ERROR }
        }
    }
}

const authService = new AuthService();

export default authService;