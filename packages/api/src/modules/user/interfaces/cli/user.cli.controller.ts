import fs from "fs";
import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import userService from "../../user.service";
import { RoleEnum } from "../../../../@enums/Roles";

@StaticImplements<CliStaticInterface>()
export default class UserCliController {
    static cmdName = "user";

    async create(email: string) {
        const result = await userService.createUser(email);

        if (!result.success) {
            console.info("User creation error : \n", result.message);
            return;
        }

        console.info("User has been created");
    }

    async setRoles(email: string, ...roles: RoleEnum[]) {
        const result = await userService.addRolesToUser(email, roles);

        if (!result.success) {
            console.info("Roles upgarde error : \n", result.message);
            return;
        }

        console.info("Roles has updated");
    }

    async active(email: string) {
        const result = await userService.activeUser(email);

        if (!result.success) {
            console.info("Active error : \n", result.message);
            return;
        }

        console.info("User has actived");
    }

    async addList(file: string) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        const results = await userService.addUsersByCsv(fileContent);

        const echec = results.filter(result => !result.success);

        console.info(`${results.length - echec.length} users addeds and ${echec.length} user rejected`);
    }
}