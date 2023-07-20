import { getContext } from "svelte";

export default class NotFoundController {
    constructor() {
        this.app = getContext("app");
    }

    get contactEmail() {
        return this.app.getContact();
    }

    openEmail() {
        window.location = `mailto:${this.contactEmail}?subject=Page%20non%20trouvée%20&body=Bonjour%2C%0A%0AJe%20ne%20parviens%20pas%20%C3%A0%20acc%C3%A9der%20%C3%A0%20la%20page%20%3A%20${window.location.href}&html=true`;
    }
}
