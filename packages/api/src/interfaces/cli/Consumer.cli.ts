import { RoleEnum } from "../../@enums/Roles";
import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import userCrudService from "../../modules/user/services/crud/user.crud.service";

@StaticImplements<CliStaticInterface>()
export default class ConsumerCli {
    static cmdName = "consumer";

    async create(email: string) {
        try {
            await userCrudService.signup({ email: email.toLocaleLowerCase() }, RoleEnum.consumer);
            console.info("Consumer user has been created");
        } catch (error) {
            const e = error as Error;
            console.info("Consumer user creation error : \n", e.message);
        }
    }
}
