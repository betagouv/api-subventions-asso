import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["password", "submit"];

  passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+=|-]).{8,32}$/;
  valueChange() {
    const value = this.passwordTarget.value;
    if (this.passwordRegex.test(value)) {
      this.submitTarget.removeAttribute("disabled");
    } else {
      this.submitTarget.setAttribute("disabled", "true");
    }
  }
}
