import { UserDto } from "dto";
import userRepository from "../../repositories/user.repository";
import { UserServiceErrors } from "../../user.service";
import { JWT_EXPIRES_TIME } from "../../../../configurations/jwt.conf";

export class UserActivationService {
    async refreshExpirationToken(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email);
        if (!userWithSecrets?.jwt) {
            return {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update(userWithSecrets);
    }
}

const userActivationService = new UserActivationService();
export default userActivationService;
