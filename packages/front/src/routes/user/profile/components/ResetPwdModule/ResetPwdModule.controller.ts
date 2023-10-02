import { getContext } from "svelte";
import Store from "$lib/core/Store";
import authService from "$lib/resources/auth/auth.service";

export class ResetPwdModuleController {
    public status: Store<"success" | "error" | undefined>;
    app: { getContact: () => string };

    constructor(private _email: string) {
        this.status = new Store(undefined);
        this.app = getContext("app");
    }

    onClick() {
        return authService
            .forgetPassword(this._email)
            .then(() => this.status.set("success"))
            .catch(() => this.status.set("error"));
    }

    get contactEmail() {
        return this.app.getContact();
    }
}
