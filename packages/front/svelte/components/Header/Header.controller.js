import { goToUrl } from "@services/router.service";

export default class HeaderController {
    goToProfil() {
        goToUrl("/user/profile");
    }
}
