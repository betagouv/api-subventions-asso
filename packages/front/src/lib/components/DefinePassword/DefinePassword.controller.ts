import { debounce } from "lodash-es";
import { checkPassword } from "$lib/services/validator.service";
import Store from "$lib/core/Store";

export default class DefinePasswordController {
    passwordErrorMsg: string;
    showPasswordError: Store<boolean>;
    confirmPwdErrorMsg: string;
    showConfirmError: Store<boolean>;
    dispatch: (_: "valid" | "error") => void;
    validatePassword: () => void;
    checkConfirm: () => void;

    // Create PasswordValidation Entity ?
    constructor(
        public values: { password: string; confirmPwd: string },
        dispatch: (_: "valid" | "error") => void = () => {},
    ) {
        this.values = values;
        this.passwordErrorMsg = "Le mot de passe ne respecte pas le format demandé";
        this.showPasswordError = new Store(false);
        this.confirmPwdErrorMsg = "Le mot de passe doit être identique";
        this.showConfirmError = new Store(false);
        this.dispatch = dispatch;

        this.validatePassword = debounce(() => this._validatePassword(), 200);
        this.checkConfirm = debounce(() => this._checkConfirm(), 200);
    }

    _validatePassword() {
        if (!this.values.password) return;
        if (checkPassword(this.values.password)) this._onPasswordValid();
        else this._onPasswordError();
    }

    _checkConfirm() {
        if (!this.values.confirmPwd) return;
        if (this.values.confirmPwd === this.values.password) this._onConfirmValid();
        else this._onConfirmError();
    }

    _onPasswordValid() {
        this.showPasswordError.set(false);
        this._onOneFieldValid();
    }

    _onConfirmValid() {
        this.showConfirmError.set(false);
        this._onOneFieldValid();
    }

    _onOneFieldValid() {
        if (!this.values.password || !this.values.confirmPwd) return this._dispatchError();
        if (!this.showPasswordError.value && !this.showConfirmError.value) this.dispatch("valid");
    }

    _onPasswordError() {
        this.showPasswordError.set(true);
        this._dispatchError();
    }

    _onConfirmError() {
        this.showConfirmError.set(true);
        this._dispatchError();
    }

    _dispatchError() {
        this.dispatch("error");
    }
}
