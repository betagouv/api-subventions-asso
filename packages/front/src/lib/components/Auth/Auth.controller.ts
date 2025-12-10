import authService from "$lib/resources/auth/auth.service";
import { page } from "$lib/store/kit.store";
import Store from "$lib/core/Store";

export default class AuthController {
    public show: Store<boolean>;
    constructor() {
        this.show = new Store(false);
    }

    async init() {
        await authService.initUserInApp();

        page.subscribe(newPage => {
            this.show.set(authService.controlAuth(newPage?.data?.authLevel));
        });
    }
}
