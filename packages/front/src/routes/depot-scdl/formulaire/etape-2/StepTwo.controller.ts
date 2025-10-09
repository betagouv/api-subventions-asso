import { goToUrl } from "$lib/services/router.service";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type { CreateDepositScdlLogDto } from "dto";
import StaticError from "$lib/errors/StaticError";

export default class StepTwoController {
    goToStep1() {
        return goToUrl("/depot-scdl/formulaire/etape-1");
    }

    isCorrectSiret(inputValue: string) {
        const cleaned = inputValue.replace(/\s+/g, "");
        return /^\d{14}$/.test(cleaned);
    }

    async onValidate(inputValue: string) {
        const sanitazedInput = inputValue.replace(/\s+/g, "");

        const data: CreateDepositScdlLogDto = {
            overwriteAlert: true,
            allocatorSiret: sanitazedInput,
        };

        try {
            const depositLog = await depositLogService.getDepositLog();
            if (depositLog) {
                await depositLogService.updateDepositLog(1, data);
            } else {
                await depositLogService.createDepositLog(data);
            }
            goToUrl("/depot-scdl/formulaire/etape-3");
        } catch (e) {
            const typedError = (e as StaticError).data as { code?: number; message?: string };
            if (typedError.code === 409) {
                goToUrl("/depot-scdl/formulaire/reprise");
            } else if (typedError.code === 400) {
                // todo : toast ou something to display error ?
            }
        }
    }
}
