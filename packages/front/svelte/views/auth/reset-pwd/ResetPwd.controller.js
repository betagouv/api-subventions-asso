import Store from "@core/Store";
import authService from "@resources/auth/auth.service";

export class ResetPwdController {
    PWD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+=|-]).{8,32}$/;
    constructor(token) {
        this.token = token;
        if (!token) {
        } // TODO: redirect
        const urlParams = new URLSearchParams(window.location.search);
        this.activation = urlParams.get("active");
        this.title = this.activation ? "Activer mon compte en créant mon mot de passe" : "Modifier votre mot de passe";

        this.promise = new Store();
        this.password = new Store("");
    }

    getErrorMessage(code) {
        return "message"; // TODO
    }

    onSubmit() {
        return this.promise.set(authService.resetPassword(this.password.value));
        // TODO
    }

    checkPassword(password) {
        return this.PWD_REGEX.test(password);
    }
}
