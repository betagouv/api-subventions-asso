import DefinePassword from "$lib/components/DefinePassword/DefinePassword.svelte";
import PasswordFormatAlert from "$lib/components/DefinePassword/PasswordFormatAlert.svelte";
import authService from "$lib/resources/auth/auth.service";
import { goToUrl } from "$lib/services/router.service";

export default class ActivateAcountController {
    constructor(token) {
        this.token = token;
        // TODO: make a call to API to validate token and display error in case it is not valid or expired
        this.steps = [{ name: "Définir un mot de passe", component: DefinePassword, alert: PasswordFormatAlert }];
    }

    onSubmit(values) {
        return authService.resetPassword(this.token, values.password).then(() => {
            goToUrl("/auth/login?success=ACCOUNT_ACTIVATED");
        });
    }
}
