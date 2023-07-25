import Store from "@core/Store";
import Dispatch from "@core/Dispatch";

export default class DefinePasswordController {
    constructor(values) {
        this.values = values;
        this.confirmErrorMsg = "Le mot de passe doit être identique";
        this.showConfirmError = new Store(false);
        this.dispatch = Dispatch.getDispatcher();
    }

    checkConfirm() {
        if (!this.values.confirm || this.values.confirm === this.values.password) this._onValid();
        else this._onError();
    }

    _onValid() {
        this.showConfirmError.set(false);
        this.dispatch("valid");
    }

    _onError() {
        this.showConfirmError.set(true);
        this.dispatch("error");
    }
}
