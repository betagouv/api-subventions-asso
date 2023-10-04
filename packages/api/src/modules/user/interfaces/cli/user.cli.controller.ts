import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import userService from "../../user.service";
import { RoleEnum } from "../../../../@enums/Roles";
import userRolesService from "../../services/roles/user.roles.service";
import userStatsService from "../../services/stats/user.stats.service";

@StaticImplements<CliStaticInterface>()
export default class UserCliController {
    static cmdName = "user";

    async create(email: string) {
        try {
            await userService.createUser({ email });
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
            await userService.activeUser(email);
            console.info("User has been activated");
        } catch (e) {
            console.info("Active error : \n", (e as Error).message);
        }
    }

    async notifyAllUsersInSubTools() {
        await userStatsService.notifyAllUsersInSubTools();
    }
}
