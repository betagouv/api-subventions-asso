import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import { RoleEnum } from "../../@enums/Roles";
import userRolesService from "../../modules/user/services/roles/user.roles.service";
import userStatsService from "../../modules/user/services/stats/user.stats.service";
import userActivationService from "../../modules/user/services/activation/user.activation.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";

@StaticImplements<CliStaticInterface>()
export default class UserCli {
    static cmdName = "user";

    async create(email: string) {
        try {
            await userCrudService.createUser({ email });
            console.info("User has been created");
        } catch (error: unknown) {
            const e = error as Error;
            console.info("User creation error : \n", e.message);
        }
    }

    async setRoles(email: string, ...roles: RoleEnum[]) {
        try {
            await userRolesService.addRolesToUser(email, roles);
        } catch (e) {
            console.info("Roles upgarde error : \n", (e as Error).message);
            return;
        }

        console.info("Roles has updated");
    }

    async active(email: string) {
        try {
            await userActivationService.activeUser(email);
            console.info("User has been activated");
        } catch (e) {
            console.info("Active error : \n", (e as Error).message);
        }
    }

    notifyAllUsersInSubTools() {
        return userStatsService.notifyAllUsersInSubTools();
    }

    async updateAllUsersInSubTools() {
        return userStatsService.updateAllUsersInSubTools();
    }

    async updateNbRequests() {
        return userStatsService.updateNbRequests();
    }
}
