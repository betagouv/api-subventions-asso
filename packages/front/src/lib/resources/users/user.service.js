import authService from "../auth/auth.service";
import userPort from "./user.port";

export class UsersService {
    SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;
    isUserActif(userDto) {
        return Date.now() - new Date(userDto.stats.lastSearchDate).getTime() <= this.SEVEN_DAYS_MS;
    }

    async deleteCurrentUser() {
        await userPort.deleteSelfUser();
        await authService.logout(true);
    }

    getSelfUser() {
        return userPort.getSelfUser();
    }

    updateProfile(data) {
        return userPort.updateProfile(data);
    }
}

const userService = new UsersService();

export default userService;
