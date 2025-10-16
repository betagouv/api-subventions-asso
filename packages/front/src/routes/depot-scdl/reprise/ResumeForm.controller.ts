import { goto } from "$app/navigation";
import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { DepositScdlLogResponseDto } from "dto";

export default class ResumeFormController {
    depositLog: DepositScdlLogResponseDto | null;

    constructor() {
        this.depositLog = null;
    }

    async loadDepositLog() {
        this.depositLog = depositLogStore.value;

        if (this.depositLog === null || this.depositLog === undefined) {
            // Needed because browser navigation resets the store
            this.depositLog = await depositLogService.getDepositLog();
            if (!this.depositLog) {
                return goto("/");
            }
        }
        return this.depositLog;
    }

    resumeForm(step: number) {
        if (step === 1) {
            return goto("/depot-scdl/formulaire/etape-3", {
                replaceState: true,
            });
        }
        if (step === 2) {
            return goto("/depot-scdl/formulaire/etape-4", {
                replaceState: true,
            });
        }
    }

    async newDeposit() {
        await depositLogService.deleteDepositLog();
        depositLogStore.set(null);
        return goto("/depot-scdl/formulaire/etape-1", {
            replaceState: true,
        });
    }
}
