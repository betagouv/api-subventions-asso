import { checkPassword } from "@services/validator.service";
import Store from "@core/Store";
import Dispatch from "@core/Dispatch";

export default class DefinePasswordController {
    constructor(values) {
        this.values = values;
        this.passwordErrorMsg = "Le mot de passe ne respecte pas le format demandé";
        this.showPasswordError = new Store(false);
        this.confirmErrorMsg = "Le mot de passe doit être identique";
        this.showConfirmError = new Store(false);
        this.dispatch = Dispatch.getDispatcher();
    }

    // TODO: debounce this
    validatePassword() {
        if (!this.values.password) return;
        if (checkPassword(this.values.password)) this._onPasswordValid();
        else this._onPasswordError();
    }

    checkConfirm() {
        if (!this.values.confirm || this.values.confirm === this.values.password) this._onConfirmValid();
        else this._onConfirmError();
    }

    _onPasswordValid() {
        this.showPasswordError.set(false);
        this._handleValidDispatch();
    }

    _onConfirmValid() {
        this.showConfirmError.set(false);
        this._handleValidDispatch();
    }

    _handleValidDispatch() {
        if (!this.showPasswordError.value && !this.showConfirmError.value) this.dispatch("valid");
    }

    _onPasswordError() {
        this.showPasswordError.set(true);
        this._handleErrorDispatch();
    }

    _onConfirmError() {
        this.showConfirmError.set(true);
        this._handleErrorDispatch();
    }

    _handleErrorDispatch() {
        if (this.showPasswordError.value || this.showConfirmError.value) this.dispatch("error");
    }
}
