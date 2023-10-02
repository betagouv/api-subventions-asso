import bcrypt from "bcrypt";

import { UserDto } from "dto";
import userRepository from "../../repositories/user.repository";
import { BadRequestError, NotFoundError } from "../../../../shared/errors/httpErrors";

export class UserAuthService {
    public async getHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    // Only used in tests
    public async findJwtByEmail(email: string): Promise<{ jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(email);

        if (!userWithSecrets) {
            throw new NotFoundError("User not found");
        }

        if (!userWithSecrets.jwt) {
            throw new BadRequestError("User is not active");
        }

        return { jwt: userWithSecrets.jwt };
    }

    public async findJwtByUser(user: UserDto) {
        const userDbo = await userRepository.getUserWithSecretsById(user._id);
        return userDbo?.jwt;
    }
}

const userAuthService = new UserAuthService();
export default userAuthService;
