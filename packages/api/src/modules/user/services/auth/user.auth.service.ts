import bcrypt from "bcrypt";

export class UserAuthService {
    public async getHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }
}

const userAuthService = new UserAuthService();
export default userAuthService;
