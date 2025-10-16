import type { CreateDepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import StaticError from "$lib/errors/StaticError";

export default class Step2Controller {
    async handleValidate(
        allocatorSiret: string,
        existingDepositLog: DepositScdlLogResponseDto | null,
    ): Promise<"success" | "resume" | "error"> {
        const data: CreateDepositScdlLogDto = { overwriteAlert: true, allocatorSiret: allocatorSiret };

        try {
            const depositLog = existingDepositLog
                ? await depositLogService.updateDepositLog(1, data)
                : await depositLogService.createDepositLog(data);

            depositLogStore.set(depositLog);

            return "success";
        } catch (e) {
            const typedError = (e as StaticError).data as { code?: number; message?: string }; // todo : create type
            if (typedError.code === 409) {
                return "resume";
            } else if (typedError.code === 400) {
                return "error";
            }
            return "error";
        }
    }
}
