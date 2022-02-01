import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../configurations/jwt.conf";
import { ROLES } from "./entities/Roles";
import User, { UserWithoutSecret } from "./entities/User";
import UserReset from "./entities/UserReset";
import { UserUpdateError } from "./repositoies/errors/UserUpdateError";
import userResetRepository from "./repositoies/user-reset.repository";

import userRepository from "./repositoies/user.repository";
import { REGEX_MAIL, REGEX_PASSWORD } from "./user.constant";

export enum UserServiceErrors {
    LOGIN_WRONG_PASSWORD_MATCH = 2,
    LOGIN_UPDATE_JWT_FAIL = 3,
    USER_NOT_ACTIVE = 9,
    CREATE_INVALID_EMAIL = 4,
    CREATE_USER_ALREADY_EXIST = 5,
    CREATE_USER_WRONG = 6,
    FORMAT_PASSWORD_INVALID = 13,
    USER_NOT_FOUND = 7,
    ROLE_NOT_FOUND = 8,
    RESET_TOKEN_NOT_FOUND = 10,
    RESET_TOKEN_EXPIRED = 11,
    CREATE_RESET_PASSWORD_WRONG = 12,
}

export interface UserServiceError {
    success: false, message: string, code: number
}

export class UserService {

    public static RESET_TIMEOUT = 1000 * 60 * 60 * 24 * 10; // 10 days in ms  

    async login(email: string, password: string): Promise<UserServiceError | { success: true, user: Omit<User, 'hashPassword'> }>{
        const user = await userRepository.findByEmail(email);

        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND};
        }

        const validPassword = await bcrypt.compare(password, await userRepository.findPassword(user) as string);

        if (!validPassword) {
            return { success: false, message: "Password does not match", code: UserServiceErrors.LOGIN_WRONG_PASSWORD_MATCH}
        }

        const jwtParams = await userRepository.findJwt(user);
        if (!user.active || !jwtParams ) {
            return { success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE}
        }

        if (Date.now() > jwtParams.expirateDate.getTime()) { // Generate new JTW Token
            const now = new Date();
            const token = jwt.sign({...user, now}, `${JWT_SECRET}`);
            
            const jwtUserParams = {
                token,
                expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME)
            }
            
            try {
                await userRepository.update({...user, jwt: jwtUserParams});
            } catch(e) {
                return { success: false, message: UserUpdateError.message, code: UserServiceErrors.LOGIN_UPDATE_JWT_FAIL};
            }
        }

        return { success: true, user: {...user, jwt: jwtParams} }
    }

    async findByEmail(email: string) {
        return userRepository.findByEmail(email);
    }

    async createUser(email: string, password = "TMP_PASSWOrd;12345678"): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        if (!REGEX_MAIL.test(email)) {
            return { success: false, message: "Email is not valid", code: UserServiceErrors.CREATE_INVALID_EMAIL }
        }

        if (await userRepository.findByEmail(email)) {
            return { success: false, message: "User is already exist", code: UserServiceErrors.CREATE_USER_ALREADY_EXIST }
        }

        if (!this.passwordValidator(password)) {
            return {
                success: false, 
                message: 
                    `Password is not hard, please use this rules:
    At least one digit [0-9]
    At least one lowercase character [a-z]
    At least one uppercase character [A-Z]
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
    At least 8 characters in length, but no more than 32.
                    `,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            }
        }

        const partialUser = {
            email,
            password: await bcrypt.hash(password, 10),
            roles: ["user"]
        };

        const jwtParams = {
            token: jwt.sign(partialUser, `${JWT_SECRET}`, { expiresIn: JWT_EXPIRES_TIME }),
            expirateDate: new Date(Date.now() + JWT_EXPIRES_TIME)
        };

        const user = new User(partialUser.email, partialUser.password, partialUser.roles, jwtParams, false);

        const createdUser = await userRepository.create(user);

        if (!createdUser) {
            return { success: false, message: "The user could not be created", code: UserServiceErrors.CREATE_USER_WRONG }
        }
        return {success: true, user: createdUser };
    }

    public async addUsersByCsv(content: Buffer) {
        const data = content
            .toString()
            .split("\n") // Select line by line
            .map(raw => raw.split(";").map(r => r.split("\t")).flat()) // Parse column
        const emails = data.map(line => line[0]).filter(email => email.length);

        return this.createUsersByList(emails);
    }

    private async createUsersByList(emails: string[]) {
        return emails.reduce(async(acc, email) => {
            const data = await acc;
            const result = await this.createUser(email);

            if (!result.success) return Promise.resolve([...data, { email, success: false, message: result.message }]);

            const resetResult = await this.resetUser(result.user);

            if (!resetResult.success) return Promise.resolve([...data, { email, success: false, message: resetResult.message }]);

            console.log("Create user, reset password:", resetResult);

            // SEND NOTIFICATION FOR END CREATED COMPTE

            return Promise.resolve([...data, { email, success: true}]);
        }, Promise.resolve([]) as Promise<{ email: string, success: boolean, message ?:string}[]>)
    }

    async addRolesToUser(user: UserWithoutSecret | string, roles: string[]): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        if (typeof user === "string") {
            const findedUser = await userRepository.findByEmail(user);
            if (!findedUser) {
                return { success: false, message: "User email does not correspond to a user", code: UserServiceErrors.USER_NOT_FOUND};
            }
            user = findedUser;
        }

        if (!roles.every(role => ROLES.includes(role))) {
            return { success: false, message: `The role "${roles.find(role => !ROLES.includes(role))}" does not exist`, code: UserServiceErrors.ROLE_NOT_FOUND };
        }

        user.roles = [...new Set([...user.roles,...roles])];
        return { success: true, user: await userRepository.update(user)} ;
    }

    async activeUser(user: UserWithoutSecret | string): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        if (typeof user === "string") {
            const findedUser = await userRepository.findByEmail(user);
            if (!findedUser) {
                return { success: false, message: "User email does not correspond to a user", code: UserServiceErrors.USER_NOT_FOUND};
            }
            user = findedUser;
        }

        user.active = true;

        return { success: true, user: await userRepository.update(user)} ;
    }

    async refrechExpirationToken(user: UserWithoutSecret) {
        const jwtParams = await userRepository.findJwt(user);
        if (!jwtParams) {
            return { success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
        }

        jwtParams.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update({...user, jwt: jwtParams});
    }

    async resetPassword(password: string, resetToken: string): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        const reset = await userResetRepository.findByToken(resetToken);

        if (!reset) {
            return { success: false, message: "Reset token not found", code: UserServiceErrors.RESET_TOKEN_NOT_FOUND }
        }

        if ((reset.createdAt.getTime() + UserService.RESET_TIMEOUT) < Date.now()) {
            return { success: false, message: "Reset token has expired, please retry forget password", code: UserServiceErrors.RESET_TOKEN_EXPIRED }
        }

        const user = await userRepository.findById(reset.userId);

        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND};
        }

        if (!this.passwordValidator(password)) {
            return {
                success: false, 
                message: 
                    `Password is not hard, please use this rules:
                        At least one digit [0-9]
                        At least one lowercase character [a-z]
                        At least one uppercase character [A-Z]
                        At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
                        At least 8 characters in length, but no more than 32.
                    `,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await userResetRepository.remove(reset);

        return { success: true, user: await userRepository.update({...user, hashPassword, active: true })};
    }

    async forgetPassword(email: string): Promise<UserServiceError | { success: true, reset: UserReset }> {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND};
        }

        const resetResult = await this.resetUser(user);

        if (resetResult.success) {
            console.log("FORGET PASSWORD:", resetResult.reset);
            // Send notification
        }

        return resetResult;
    }

    async resetUser(user: UserWithoutSecret): Promise<UserServiceError | { success: true, reset: UserReset }>  {
        await userResetRepository.removeAllByUserId(user._id);
        const reset = new UserReset(user._id, await bcrypt.hash(user.email, Math.random() * 10 + 1), new Date());
        
        const createdReset = await userResetRepository.create(reset);

        if (!createdReset) {
            return {success: false, message: "The user reset password could not be created", code: UserServiceErrors.CREATE_RESET_PASSWORD_WRONG }
        }

        user.active = false;
        
        await userRepository.update(user);

        return { success: true, reset: createdReset };
    }

    async findJwtByEmail(email: string) : Promise<UserServiceError | { success: true, jwt: {token: string; expirateDate: Date}}> {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND};
        }

        const jwt = await userRepository.findJwt(user);

        if (!jwt) {
            return { success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
        }

        return { success: true, jwt };
    }

    private passwordValidator(password: string): boolean  {
        return REGEX_PASSWORD.test(password);
    }
}

const userService = new UserService();

export default userService;