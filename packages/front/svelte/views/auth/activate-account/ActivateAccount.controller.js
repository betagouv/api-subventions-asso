import DefinePassword from "../define-password/DefinePassword.svelte";
import PasswordFormatAlert from "../define-password/PasswordFormatAlert.svelte";

export default class ActivateAcountController {
    constructor() {
        this.steps = [{ name: "Définir un mot de passe", component: DefinePassword, alert: PasswordFormatAlert }];
    }
}
