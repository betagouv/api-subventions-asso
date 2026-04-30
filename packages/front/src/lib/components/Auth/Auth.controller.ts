import authService from "$lib/resources/auth/auth.service";
import { page } from "$lib/store/kit.store";
import Store from "$lib/core/Store";

export default class AuthController {
    public show: Store<boolean>;
    constructor() {
        this.show = new Store(false);
    }

    async init() {
        page.subscribe(async newPage => {
            const show = await authService.controlAuth(newPage?.data?.authLevel);
            this.show.set(show);
        });
    }
}
