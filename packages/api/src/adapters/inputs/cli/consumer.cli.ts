import { UserRoles } from "../../../domain/users/@types/UserRoles";
import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import userCrudService from "../../../modules/user/services/crud/user.crud.service";
import NewUserEntity from "../../../domain/users/NewUserEntity";

@StaticImplements<CliStaticInterface>()
export default class ConsumerCli {
    static cmdName = "consumer";

    async create(email: string) {
        try {
            await userCrudService.signup(
                new NewUserEntity({ email: email.toLocaleLowerCase(), roles: [UserRoles.CONSUMER] }),
            );
            console.info("Consumer user has been created");
        } catch (error) {
            const e = error as Error;
            console.info("Consumer user creation error : \n", e.message);
        }
    }
}
