import {
    LoginDtoErrorCodes,
    LoginDtoNegativeResponse,
    LoginDtoPositiveResponse,
    ResetPasswordDtoNegativeResponse,
    ResetPasswordErrorCodes
} from "@api-subventions-asso/dto";
import axios, { AxiosError } from "axios";
import apiDatasubService from "../../shared/apiDatasub.service";

function isNegativeResponse<T>(data: any): data is T {
    return !!data.message;
}

export class AuthService {
    async login(
        email: string,
        password: string
    ): Promise<{ type: "SUCCESS"; data: LoginDtoPositiveResponse } | { type: "ERROR"; code: LoginDtoErrorCodes }> {
        try {
            const result = await apiDatasubService.login(email as string, password);
            return { type: "SUCCESS", data: result.data as LoginDtoPositiveResponse };
        } catch (e) {
            let errorCode = LoginDtoErrorCodes.INTERNAL_ERROR;
            if (axios.isAxiosError(e)) {
                const errorData = e.response?.data as LoginDtoNegativeResponse;
                if (e.response?.data) errorCode = errorData.errorCode;
            }
            return { type: "ERROR", code: errorCode };
        }
    }

    async forgetPassword(email: string): Promise<{ type: "REDIRECT" | "SUCCESS" | "ERROR"; data?: unknown }> {
        try {
            const result = await apiDatasubService.forgetPassword(email);
            return { type: "SUCCESS", data: result.data };
        } catch (e) {
            return { type: "ERROR" };
        }
    }
}

const authService = new AuthService();

export default authService;
