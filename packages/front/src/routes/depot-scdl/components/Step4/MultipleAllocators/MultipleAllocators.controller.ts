import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { EventDispatcher } from "svelte";
import errorService from "$lib/services/error.service";

type EventMap = {
    prevStep: void;
    restartNewForm: void;
    error: string;
};

export default class MultipleAllocatorsController {
    private readonly dispatch: EventDispatcher<EventMap>;

    constructor(dispatch: EventDispatcher<EventMap>) {
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
            errorService.handleError(e);
        }
    }
}
