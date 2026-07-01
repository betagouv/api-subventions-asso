import { InternalServerError, NotFoundError } from "core";
import userCrudService from "../crud/user.crud.service";
import userAuthService from "../auth/user.auth.service";
import { ConsumerToken } from "../../entities/ConsumerToken";
import consumerTokenAdapter from "../../../../adapters/outputs/db/user/consumer-token.adapter";
import { UserServiceErrors } from "../../user.enum";
import NewUserEntity from "../../../../domain/users/NewUserEntity";

export class UserConsumerService {
    public static CONSUMER_TOKEN_PROP = "isConsumerToken" as const;

    async createConsumer(newUser: NewUserEntity) {
        const user = await userCrudService.createUser(newUser);

        const consumerToken = userAuthService.buildJWTToken(user, {
            [UserConsumerService.CONSUMER_TOKEN_PROP]: true,
            expiration: false,
        });

        try {
            await consumerTokenAdapter.create(new ConsumerToken(user.id, consumerToken));
            return user;
        } catch {
            await userCrudService.delete(user.id);
            throw new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN);
        }
    }

    async findConsumerToken(userId: string): Promise<string> {
        const token = await consumerTokenAdapter.findToken(userId);
        if (!token) {
            throw new NotFoundError("Aucun token d'authentification n'a été trouvé");
        }
        return token;
    }
}

const userConsumerService = new UserConsumerService();
export default userConsumerService;
