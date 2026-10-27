import Store from "$lib/core/Store";
import authService from "$lib/resources/auth/auth.service";

export default class ForgetPwdController {
    errorMsgByStatus = {
        403: 'Votre compte est joint à Pro Connect. Utilisez le bouton "S\'identifier avec ProConnect" pour vous connecter.',
    };
    email = new Store("");
    promise = new Store(Promise.resolve(false));
    firstSubmitted = new Store(false);

    constructor() {}

    onSubmit() {
        this.promise.set(authService.forgetPassword(this.email.value));
        this.firstSubmitted.set(true);
    }
}
