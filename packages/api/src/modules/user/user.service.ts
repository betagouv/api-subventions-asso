import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId, WithId } from "mongodb";
import * as RandToken from "rand-token";
import { DefaultObject } from "../../@types";
import { ACCEPTED_EMAIL_DOMAIN } from "../../configurations/auth.conf";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../configurations/jwt.conf";
import mailNotifierService from "../mail-notifier/mail-notifier.service";
import { ROLES } from "./entities/Roles";
import User, { UserWithoutSecret } from "./entities/User";
import UserReset from "./entities/UserReset";
import { UserUpdateError } from "./repositoies/errors/UserUpdateError";
import userResetRepository from "./repositoies/user-reset.repository";

import userRepository from "./repositoies/user.repository";
import { REGEX_MAIL, REGEX_PASSWORD } from "./user.constant";

export enum UserServiceErrors {
    LOGIN_WRONG_PASSWORD_MATCH = 1,
    LOGIN_UPDATE_JWT_FAIL = 2,
    USER_NOT_ACTIVE = 3,
    CREATE_INVALID_EMAIL = 4,
    CREATE_USER_ALREADY_EXIST = 5,
    CREATE_USER_WRONG = 6,
    FORMAT_PASSWORD_INVALID = 7,
    USER_NOT_FOUND = 8,
    ROLE_NOT_FOUND = 9,
    RESET_TOKEN_NOT_FOUND = 10,
    RESET_TOKEN_EXPIRED = 11,
    CREATE_RESET_PASSWORD_WRONG = 12,
    CREATE_EMAIL_GOUV = 13,
}

export interface UserServiceError {
    success: false, message: string, code: number
}

export class UserService {

    public static RESET_TIMEOUT = 1000 * 60 * 60 * 24 * 10; // 10 days in ms
    public static PASSWORD_VALIDATOR_MESSAGE =
        `Password is not hard, please use this rules:
    At least one digit [0-9]
    At least one lowercase character [a-z]
    At least one uppercase character [A-Z]
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
    At least 8 characters in length, but no more than 32.
                    `

    async login(email: string, password: string): Promise<UserServiceError | { success: true, user: Omit<User, 'hashPassword'> }> {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());

        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
        }

        let jwtParams = await userRepository.findJwt(user);
        if (!user.active || !jwtParams) {
            return { success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE }
        }

        const validPassword = await bcrypt.compare(password, await userRepository.findPassword(user) as string);

        if (!validPassword) {
            return { success: false, message: "Password does not match", code: UserServiceErrors.LOGIN_WRONG_PASSWORD_MATCH }
        }

        const token = jwt.verify(jwtParams.token, JWT_SECRET) as jwt.JwtPayload;
        if (new Date(token.now).getTime() + JWT_EXPIRES_TIME < Date.now()) { // Generate new JTW Token
            const now = new Date();
            const token = jwt.sign({ ...user, now }, JWT_SECRET);

            const jwtUserParams = {
                token,
                expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME)
            }

            try {
                await userRepository.update({ ...user, jwt: jwtUserParams });
                jwtParams = jwtUserParams;
            } catch (e) {
                return { success: false, message: UserUpdateError.message, code: UserServiceErrors.LOGIN_UPDATE_JWT_FAIL };
            }
        }

        return { success: true, user: { ...user, jwt: jwtParams } }
    }

    public async logout(user: UserWithoutSecret) {
        const jwtParams = await userRepository.findJwt(user);
        if (!jwtParams) { // No jwt, so user is already disconected
            return user;
        }

        const jwtUserParams = {
            token: jwtParams.token,
            expirateDate: new Date('01/01/1970')
        }

        return userRepository.update({ ...user, jwt: jwtUserParams });
    }

    async findByEmail(email: string) {
        return userRepository.findByEmail(email.toLocaleLowerCase());
    }

    async find(query: DefaultObject = {}) {
        return userRepository.find(query)
    }

    async createUser(email: string, password = "TMP_PASSWOrd;12345678"): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        const validUser = await this.validEmailAndPassword(email.toLocaleLowerCase(), password);

        if (!validUser.success) return validUser;

        const partialUser = {
            email: email.toLocaleLowerCase(),
            hashPassword: await bcrypt.hash(password, 10),
            signupAt: new Date(),
            roles: ["user"]
        };

        const jwtParams = {
            token: jwt.sign(partialUser, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME }),
            expirateDate: new Date(Date.now() + JWT_EXPIRES_TIME)
        };

        const stats = {
            searchCount: 0,
        }

        const user = new User({
            ...partialUser,
            jwt: jwtParams,
            active: false,
            stats
        });

        const createdUser = await userRepository.create(user);

        if (!createdUser) {
            return { success: false, message: "The user could not be created", code: UserServiceErrors.CREATE_USER_WRONG };
        }

        return { success: true, user: createdUser };
    }

    public async updatePassword(currentUser: UserWithoutSecret, password: string): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        if (!this.passwordValidator(password)) {
            return {
                success: false,
                message: UserService.PASSWORD_VALIDATOR_MESSAGE,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            }
        }

        return { success: true, user: await userRepository.update({ ...currentUser, hashPassword: await bcrypt.hash(password, 10), active: true }) };
    }

    public async update(currentUser: UserWithoutSecret): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        const emailIsValid = this.validEmail(currentUser.email);
        if (!emailIsValid.success) {
            return emailIsValid;
        }
        return { success: true, user: await userRepository.update(currentUser) };
    }

    public async delete(currentUser: UserWithoutSecret | { _id: ObjectId }): Promise<{ success: boolean }> {
        return { success: await userRepository.delete(currentUser) };
    }

    public async addUsersByCsv(content: Buffer) {
        const data = content
            .toString()
            .split("\n") // Select line by line
            .map(raw => raw.split(";").map(r => r.split("\t")).flat()) // Parse column
        const emails = data.map(line => line[0]).filter(email => email.length);

        return this.createUsersByList(emails);
    }

    public async createUsersByList(emails: string[]) {
        return emails.reduce(async (acc, email) => {
            const data = await acc;
            const result = await this.signup(email.toLocaleLowerCase());
            return Promise.resolve([...data, { email, ...result }]);
        }, Promise.resolve([]) as Promise<{ email: string, success: boolean, message?: string }[]>)
    }

    public async signup(email: string): Promise<UserServiceError | { success: true, email: string }> {
        const result = await this.createUser(email.toLocaleLowerCase());

        if (!result.success) return { success: false, message: result.message, code: result.code };

        const resetResult = await this.resetUser(result.user);

        if (!resetResult.success) return { success: false, message: resetResult.message, code: resetResult.code };

        await mailNotifierService.sendCreationMail(email.toLocaleLowerCase(), resetResult.reset.token);

        return { email, success: true };
    }

    async addRolesToUser(user: UserWithoutSecret | string, roles: string[]): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        if (typeof user === "string") {
            const findedUser = await userRepository.findByEmail(user);
            if (!findedUser) {
                return { success: false, message: "User email does not correspond to a user", code: UserServiceErrors.USER_NOT_FOUND };
            }
            user = findedUser;
        }

        if (!roles.every(role => ROLES.includes(role))) {
            return { success: false, message: `The role "${roles.find(role => !ROLES.includes(role))}" does not exist`, code: UserServiceErrors.ROLE_NOT_FOUND };
        }

        user.roles = [...new Set([...user.roles, ...roles])];
        return { success: true, user: await userRepository.update(user) };
    }

    async activeUser(user: UserWithoutSecret | string): Promise<UserServiceError | { success: true, user: UserWithoutSecret }> {
        if (typeof user === "string") {
            const findedUser = await userRepository.findByEmail(user);
            if (!findedUser) {
                return { success: false, message: "User email does not correspond to a user", code: UserServiceErrors.USER_NOT_FOUND };
            }
            user = findedUser;
        }

        user.active = true;

        return { success: true, user: await userRepository.update(user) };
    }

    async refrechExpirationToken(user: UserWithoutSecret) {
        const jwtParams = await userRepository.findJwt(user);
        if (!jwtParams) {
            return { success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
        }

        jwtParams.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update({ ...user, jwt: jwtParams });
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
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
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

        return { success: true, user: await userRepository.update({ ...user, hashPassword, active: true }) };
    }

    async forgetPassword(email: string): Promise<UserServiceError | { success: true, reset: UserReset }> {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());
        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
        }

        const resetResult = await this.resetUser(user);

        if (resetResult.success) {
            mailNotifierService.sendForgetPassword(email.toLocaleLowerCase(), resetResult.reset.token);
        }

        return resetResult;
    }

    async resetUser(user: UserWithoutSecret): Promise<UserServiceError | { success: true, reset: UserReset }> {
        await userResetRepository.removeAllByUserId(user._id);

        const token = RandToken.generate(32)
        const reset = new UserReset(user._id, token, new Date());

        const createdReset = await userResetRepository.create(reset);

        if (!createdReset) {
            return { success: false, message: "The user reset password could not be created", code: UserServiceErrors.CREATE_RESET_PASSWORD_WRONG }
        }

        user.active = false;

        await userRepository.update(user);

        return { success: true, reset: createdReset };
    }

    async findJwtByEmail(email: string): Promise<UserServiceError | { success: true, jwt: { token: string; expirateDate: Date } }> {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());
        if (!user) {
            return { success: false, message: "User not found", code: UserServiceErrors.USER_NOT_FOUND };
        }

        const jwt = await userRepository.findJwt(user);

        if (!jwt) {
            return { success: false, message: "User is not active", code: UserServiceErrors.USER_NOT_ACTIVE };
        }

        return { success: true, jwt };
    }

    async findJwtByUser(user: UserWithoutSecret) {
        return userRepository.findJwt(user);
    }

    async findUserResetByUserId(userId: ObjectId) {
        return userResetRepository.findByUserId(userId)
    }

    private passwordValidator(password: string): boolean {
        return REGEX_PASSWORD.test(password);
    }

    public getRoles(user: User) {
        return user.roles
    }

    public async listUsers() {
        const users = (await userRepository.find()).filter(user => user) as WithId<UserWithoutSecret>[];
        return {
            success: true,
            users: await Promise.all(users.map(async user => {
                const reset = await userResetRepository.findByUserId(user._id);
                return {
                    ...user,
                    _id: user._id.toString(),
                    resetToken: reset?.token,
                    resetTokenDate: reset?.createdAt
                }
            }))
        }
    }

    private async validEmailAndPassword(email: string, password: string): Promise<UserServiceError | { success: true }> {
        const emailValid = this.validEmail(email);

        if (!emailValid.success) return emailValid;

        if (await userRepository.findByEmail(email)) {
            return { success: false, message: "User is already exist", code: UserServiceErrors.CREATE_USER_ALREADY_EXIST }
        }

        if (!this.passwordValidator(password)) {
            return {
                success: false,
                message: UserService.PASSWORD_VALIDATOR_MESSAGE,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            }
        }

        return { success: true }
    }

    private validEmail(email: string): UserServiceError | { success: true } {
        if (!REGEX_MAIL.test(email)) {
            return { success: false, message: "Email is not valid", code: UserServiceErrors.CREATE_INVALID_EMAIL }
        }

        if (!ACCEPTED_EMAIL_DOMAIN.some(domain => email.endsWith(domain))) {
            return { success: false, message: `Email must be end by ${ACCEPTED_EMAIL_DOMAIN.join(",")}`, code: UserServiceErrors.CREATE_EMAIL_GOUV }
        }

        return { success: true }
    }
}

const userService = new UserService();

export default userService;