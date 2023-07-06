import { RoleEnum } from "../../../../@enums/Roles";
import { CliStaticInterface } from "../../../../@types";
import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import userService from "../../user.service";

@StaticImplements<CliStaticInterface>()
export default class ConsumerCliController {
    static cmdName = "consumer";

    async create(email: string) {
        try {
            await userService.signup({ email }, RoleEnum.consumer);
            console.info("Consumer user has been created");
        } catch (error) {
            const e = error as Error;
            console.info("Consumer user creation error : \n", e.message);
        }
    }
}
