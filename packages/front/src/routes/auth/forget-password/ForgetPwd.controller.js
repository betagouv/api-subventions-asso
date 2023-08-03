import Store from "$lib/core/Store";
import authService from "$lib/resources/auth/auth.service";

export default class ForgetPwdController {
    constructor() {
        this.email = new Store("");
        this.promise = new Store(Promise.resolve());
        this.firstSubmitted = new Store(false);
    }

    onSubmit() {
        this.promise.set(authService.forgetPassword(this.email.value));
        this.firstSubmitted.set(true);
    }
}
