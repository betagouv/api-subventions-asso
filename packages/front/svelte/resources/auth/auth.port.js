// TODO update import after switch svelte to ts #330
import { SignupErrorCodes } from "@api-subventions-asso/dto/build/auth/SignupDtoResponse";
import axios from "axios";

export class AuthPort {
    BASE_PATH = "/auth";

    signup(email) {
        const defaultErrorCode = SignupErrorCodes.CREATION_ERROR;
        const path = `${this.BASE_PATH}/signup`;
        return axios
            .post(path, { email })
            .then(result => result.data.email)
            .catch(error => {
                const errorCode = error?.response?.data?.errorCode || defaultErrorCode;
                throw new Error(errorCode);
            });
    }

    resetPassword(token, password) {}
}

const authPort = new AuthPort();

export default authPort;
