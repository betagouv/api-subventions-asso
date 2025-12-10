import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";

export default class ResumeFormController {
    async handleRestartDeposit() {
        try {
            await depositLogService.deleteDepositLog();
            depositLogStore.set(null);
            return true;
        } catch (e) {
            console.error("Erreur lors de la réinitialisation du dépôt", e); // todo : error handling
            return false;
        }
    }
}
