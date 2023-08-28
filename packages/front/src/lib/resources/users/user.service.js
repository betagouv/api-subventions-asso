import userPort from "./user.port";
import { goToUrl } from "$lib/services/router.service";

export class UsersService {
    SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
    isUserActif(userDto) {
        return Date.now() - new Date(userDto.stats.lastSearchDate).getTime() <= this.SEVEN_DAYS_MS;
    }

    async deleteCurrentUser() {
        await userPort.deleteSelfUser();
        goToUrl("/auth/signup", false);
    }
}

const userService = new UsersService();

export default userService;
