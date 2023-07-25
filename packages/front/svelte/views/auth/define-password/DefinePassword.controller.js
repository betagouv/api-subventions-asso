import Store from "@core/Store";

export default class DefinePasswordController {
    constructor(values) {
        this.values = values;
        this.confirmErrorMsg = "Le mot de passe doit être identique";
        this.showConfirmError = new Store(false);
    }

    checkConfirm() {
        if (!this.values.confirm || this.values.confirm === this.values.password) this.showConfirmError.set(false);
        else this.showConfirmError.set(true);
    }
}
