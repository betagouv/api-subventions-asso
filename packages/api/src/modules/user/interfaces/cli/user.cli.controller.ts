import fs from "fs";
import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import userService from "../../user.service";
import { RoleEnum } from "../../../../@enums/Roles";
import { csvParse } from "../../../../shared/helpers/ParserHelper";

@StaticImplements<CliStaticInterface>()
export default class UserCliController {
    static cmdName = "user";

    async create(email: string) {
        try {
            await userService.createUser(email);
            console.info("User has been created");
        } catch (error: unknown) {
            const e = error as Error;
            console.info("User creation error : \n", e.message);
        }
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
        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);
        const emails = csvParse(fileContent).flat();

        const results = await userService.createUsersByList(emails);
        const failureCount = emails.length - results.length;

        console.info(`${results.length} users added and ${failureCount} users rejected`);
    }
}
