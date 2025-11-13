import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

type EventMap = {
    prevStep: void;
    restartNewForm: void;
    error: string;
};

type DispatchFunction = <K extends keyof EventMap>(
    type: K,
    detail?: EventMap[K] extends void ? never : EventMap[K],
) => void;

export default class MultipleAllocatorsController {
    private readonly dispatch: DispatchFunction;

    constructor(dispatch: DispatchFunction) {
        this.dispatch = dispatch;
    }

    restartUploadFile() {
        this.dispatch("prevStep");
    }

    async restartNewDeposit() {
        try {
            await depositLogService.deleteDepositLog();
            depositLogStore.set(null);
            this.dispatch("restartNewForm");
        } catch (e) {
            console.error("Erreur lors de la réinitialisation du dépôt", e); // todo : error handling
        }
    }
}
