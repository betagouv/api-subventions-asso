import { ObjectId } from "mongodb";
import { FutureUserDto } from "dto";
import { InternalServerError, NotFoundError } from "core";
import userCrudService from "../crud/user.crud.service";
import userAuthService from "../auth/user.auth.service";
import { RoleEnum } from "../../../../@enums/Roles";
import { ConsumerToken } from "../../entities/ConsumerToken";
import consumerTokenPort from "../../../../dataProviders/db/user/consumer-token.port";
import { UserServiceErrors } from "../../user.enum";

export class UserConsumerService {
    public static CONSUMER_TOKEN_PROP = "isConsumerToken";

    async createConsumer(userObject: FutureUserDto) {
        const user = await userCrudService.createUser({ ...userObject, roles: [RoleEnum.user, RoleEnum.consumer] });
        const consumerToken = userAuthService.buildJWTToken(
            { ...user, [UserConsumerService.CONSUMER_TOKEN_PROP]: true },
            { expiration: false },
        );
        try {
            await consumerTokenPort.create(new ConsumerToken(user._id, consumerToken));
            return user;
        } catch {
            await userCrudService.delete(user._id.toString());
            throw new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN);
        }
    }

    async findConsumerToken(userId: ObjectId): Promise<string> {
        const token = await consumerTokenPort.findToken(userId);
        if (!token) {
            throw new NotFoundError("Aucun token d'authentification n'a été trouvé");
        }
        return token;
    }
}

const userConsumerService = new UserConsumerService();
export default userConsumerService;
