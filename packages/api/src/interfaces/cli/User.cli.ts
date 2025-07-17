import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import userStatsService from "../../modules/user/services/stats/user.stats.service";
import userActivationService from "../../modules/user/services/activation/user.activation.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import { DEFAULT_PASSWORD } from "../../../tests/__helpers__/userHelper";

@StaticImplements<CliStaticInterface>()
export default class UserCli {
    static cmdName = "user";

    async createAdmin(email: string) {
        try {
            const user = await userCrudService.createUser({ email, roles: ["admin", "user"] });
            console.info("Admin user has been created");

            await userActivationService.setsPasswordAndActivate(user, DEFAULT_PASSWORD);
            console.info(
                "User has been activated. Please change password the usual route if you are in production to ensure the password is not logged so at risk",
            );
        } catch (error: unknown) {
            const e = error as Error;
            console.info("User creation error : \n", e.message);
        }
    }

    updateNbRequests() {
        return userStatsService.updateNbRequests();
    }
}
