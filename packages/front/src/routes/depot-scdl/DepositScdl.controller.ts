import { goToUrl } from "$lib/services/router.service";

export default class DepositScdlController {
    goToStep1() {
        return goToUrl("/depot-scdl/formulaire/etape-1");
    }
}
