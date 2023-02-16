import { LoginDtoErrorCodes, LoginDtoNegativeResponse, LoginDtoPositiveResponse } from "@api-subventions-asso/dto";
import axios from "axios";
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
            let code = LoginDtoErrorCodes.INTERNAL_ERROR;
            if (axios.isAxiosError(e)) {
                const errorData = e.response?.data as LoginDtoNegativeResponse;
                if (e.response?.data) code = errorData.code;
            }
            return { type: "ERROR", code };
        }
    }
}

const authService = new AuthService();

export default authService;
