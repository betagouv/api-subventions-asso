import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import userStatsService from "../../modules/user/services/stats/user.stats.service";
import userActivationService from "../../modules/user/services/activation/user.activation.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import userRgpdService from "../../modules/user/services/rgpd/user.rgpd.service";
import { RoleEnum } from "../../@enums/Roles";

@StaticImplements<CliStaticInterface>()
export default class UserCli {
    static cmdName = "user";

    async createAdmin(email: string) {
        try {
            const user = await userCrudService.createUser({ email, roles: [RoleEnum.admin, RoleEnum.user] });
            console.info("Admin user has been created");

            await userActivationService.setsPasswordAndActivate(user);
            console.info(
                "User has been activated. Please change password with the usual route if you are in production to ensure the password is safe",
            );
        } catch (error: unknown) {
            const e = error as Error;
            console.info("User creation error : \n", e.message);
        }
    }

    updateNbRequests() {
        return userStatsService.updateNbRequests();
    }

    warnInactivity() {
        return userRgpdService.warnDisableInactive();
    }

    removeInactiveUsers() {
        return userRgpdService.bulkDisableInactive();
    }
}
