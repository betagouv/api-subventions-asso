import { getContext } from "svelte";
import { goToUrl } from "@services/router.service";

export default class NotFoundController {
    constructor() {
        this.app = getContext("app");
    }

    toHome() {
        goToUrl("/", false);
    }

    openMail() {
        console.log(window.location);
        window.location = `mailto:${this.app.getContact()}?subject=Page%20non%20trouvée%20&body=Bonjour%2C%0A%0Aje%20n%27arrive%20pas%20%C3%A0%20acc%C3%A9der%20%C3%A0%20la%20page%20%3A%20&html=true`;
    }
}
