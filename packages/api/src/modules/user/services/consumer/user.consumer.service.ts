import { FutureUserDto } from "dto";
import userCrudService from "../crud/user.crud.service";
import userAuthService from "../auth/user.auth.service";
import { RoleEnum } from "../../../../@enums/Roles";
import { InternalServerError } from "../../../../shared/errors/httpErrors";
import { ConsumerToken } from "../../entities/ConsumerToken";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import { UserService, UserServiceErrors } from "../../user.service";

export class UserConsumerService {
    async createConsumer(userObject: FutureUserDto) {
        const user = await userCrudService.createUser({ ...userObject, roles: [RoleEnum.user, RoleEnum.consumer] });
        const consumerToken = userAuthService.buildJWTToken(
            { ...user, [UserService.CONSUMER_TOKEN_PROP]: true },
            { expiration: false },
        );
        try {
            await consumerTokenRepository.create(new ConsumerToken(user._id, consumerToken));
            return user;
        } catch (e) {
            await userCrudService.delete(user._id.toString());
            throw new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN);
        }
    }
}

const userConsumerService = new UserConsumerService();
export default userConsumerService;
