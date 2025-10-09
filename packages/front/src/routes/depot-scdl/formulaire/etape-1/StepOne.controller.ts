import { goToUrl } from "$lib/services/router.service";

export default class StepOneController {
    goToStep2() {
        return goToUrl("/depot-scdl/formulaire/etape-2");
    }

    goToDepositWelcomePage() {
        return goToUrl("/depot-scdl");
    }
}
