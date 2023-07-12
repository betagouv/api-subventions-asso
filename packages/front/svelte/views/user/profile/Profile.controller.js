import Store from "@core/Store";
import userService from "@resources/users/user.service";

export class ProfileController {
    constructor() {
        this.error = new Store(false);
    }

    async deleteUser() {
        try {
            this.error.set(false);
            await userService.deleteCurrentUser();
        } catch (e) {
            this.error.set(true);
        }
    }
}
