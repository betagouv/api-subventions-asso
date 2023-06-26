import userPort from "./user.port";
import authService from "@resources/auth/auth.service";

export class UsersService {
    SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
    isUserActif(userDto) {
        return Date.now() - new Date(userDto.stats.lastSearchDate).getTime() <= this.SEVEN_DAYS_MS;
    }

    deleteCurrentUser() {
        userPort.deleteSelfUser();
        authService.logout();
    }
}

const userService = new UsersService();

export default userService;
