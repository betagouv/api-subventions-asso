import type { EventDispatcher } from "svelte";
import _ from "lodash";
import { checkPassword } from "$lib/services/validator.service";
import Store from "$lib/core/Store";
import Dispatch from "$lib/core/Dispatch";

export default class DefinePasswordController {
    passwordErrorMsg: string;
    showPasswordError: Store<boolean>;
    confirmPwdErrorMsg: string;
    showConfirmError: Store<boolean>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: EventDispatcher<any>;
    validatePassword: () => void;
    checkConfirm: () => void;

    // Create PasswordValidation Entity ?
    constructor(public values: { password: string; confirmPwd: string }) {
        this.values = values;
        this.passwordErrorMsg = "Le mot de passe ne respecte pas le format demandé";
        this.showPasswordError = new Store(false);
        this.confirmPwdErrorMsg = "Le mot de passe doit être identique";
        this.showConfirmError = new Store(false);
        this.dispatch = Dispatch.getDispatcher();

        this.validatePassword = _.debounce(() => this._validatePassword(), 200);
        this.checkConfirm = _.debounce(() => this._checkConfirm(), 200);
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
