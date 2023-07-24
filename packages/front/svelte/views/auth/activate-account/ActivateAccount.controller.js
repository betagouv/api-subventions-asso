import DefinePassword from "../define-password/DefinePassword.svelte";
import PasswordAlert from "../define-password/PasswordAlerte.svelte";

export default class ActivateAcountController {
    constructor() {
        this.steps = [{ name: "Définir un mot de passe", component: DefinePassword, alert: PasswordAlert }];
    }
}
