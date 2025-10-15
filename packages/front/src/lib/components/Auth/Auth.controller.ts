import authService from "$lib/resources/auth/auth.service";
import { page } from "$lib/store/kit.store";
import Store from "$lib/core/Store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";

export default class AuthController {
    public show: Store<boolean>;
    constructor() {
        this.show = new Store(false);
    }

    async init() {
        await authService.initUserInApp();

        const depositLog = await depositLogService.getDepositLog();
        depositLogStore.set(depositLog);

        page.subscribe(newPage => {
            this.show.set(authService.controlAuth(newPage?.data?.authLevel));
        });
    }
}
