import { goToUrl } from "$lib/services/router.service";
import authService from "$lib/resources/auth/auth.service";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import type StaticError from "$lib/errors/StaticError";

export default class HeaderController {
    async logout() {
        return authService.logout();
    }

    goToProfile() {
        return goToUrl("/user/profile");
    }

    async goToBeginOrResumeDeposit() {
        try {
            const depositLog = await depositLogService.getDepositLog();
            if (depositLog) {
                return goToUrl("/depot-scdl/formulaire/reprise");
            }
            return goToUrl("/depot-scdl");
        } catch (e) {
            const typedError = (e as StaticError).data as { code?: number; message?: string };
            if (typedError.code === 401) {
                return goToUrl("/auth/login");
            }
        }
    }
}
