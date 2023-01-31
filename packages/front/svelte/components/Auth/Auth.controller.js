import axios from "axios";
import authService from "@resources/auth/auth.service";

export default class AuthController {
    initCurrentUserInApp() {
        return new Promise(resovle => {
            const user = authService.getCurrentUser();
            // set header token for each requests
            axios.defaults.headers.common["x-access-token"] = user?.jwt?.token;
            resovle();
        });
    }
}
