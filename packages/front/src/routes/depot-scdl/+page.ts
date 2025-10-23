import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";

export const load = async () => {
    if (depositLogStore.value) return; // already initialized on app startup when connected
    const depositLog = await depositLogService.getDepositLog();
    depositLogStore.set(depositLog); // this fetch deposit log only if we just logged in
};
