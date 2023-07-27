import DefinePassword from "../define-password/DefinePassword.svelte";
import PasswordFormatAlert from "../define-password/PasswordFormatAlert.svelte";
import authService from "@resources/auth/auth.service";

export default class ActivateAcountController {
    constructor(token) {
        this.token = token;
        // TODO: make a call to API to validate token and display error in case it is not valid or expired
        this.steps = [{ name: "Définir un mot de passe", component: DefinePassword, alert: PasswordFormatAlert }];
    }

    onSubmit(values) {
        return authService.resetPassword(this.token, values.password).then(() => {
            window.location.assign("/auth/login?success=ACCOUNT_ACTIVATED");
        });
    }
}
