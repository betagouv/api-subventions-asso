import UserDto, { UserWithResetTokenDto } from "@api-subventions-asso/dto/user/UserDto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import * as RandToken from "rand-token";
import { RoleEnum } from "../../@enums/Roles";
import { DefaultObject } from "../../@types";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../configurations/jwt.conf";
import mailNotifierService from "../mail-notifier/mail-notifier.service";
import { ConsumerToken } from "./entities/ConsumerToken";
import consumerTokenRepository from "./repositories/consumer-token.repository";
import { UserUpdateError } from "./repositories/errors/UserUpdateError";
import userResetRepository from "./repositories/user-reset.repository";
import UserNotPersisted from "./entities/UserNotPersisted";
import UserReset from "./entities/UserReset";
import UserDbo from "./repositories/dbo/UserDbo";
import dedent from "dedent";

import userRepository from "./repositories/user.repository";
import { REGEX_MAIL, REGEX_PASSWORD } from "./user.constant";
import configurationsService from "../configurations/configurations.service";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from "../../shared/errors/httpErrors";
import { LoginDtoErrorCodes, ResetPasswordErrorCodes } from "@api-subventions-asso/dto";

export enum UserServiceErrors {
    LOGIN_WRONG_PASSWORD_MATCH,
    LOGIN_UPDATE_JWT_FAIL,
    USER_NOT_ACTIVE,
    CREATE_INVALID_EMAIL,
    CREATE_USER_ALREADY_EXIST,
    CREATE_USER_WRONG,
    FORMAT_PASSWORD_INVALID,
    USER_NOT_FOUND,
    ROLE_NOT_FOUND,
    RESET_TOKEN_NOT_FOUND,
    RESET_TOKEN_EXPIRED,
    CREATE_RESET_PASSWORD_WRONG,
    CREATE_EMAIL_GOUV,
    CREATE_CONSUMER_TOKEN,
    USER_TOKEN_EXPIRED
}

export interface UserServiceError {
    success: false;
    message: string;
    code: number;
}

export class UserService {
    public static RESET_TIMEOUT = 1000 * 60 * 60 * 24 * 10; // 10 days in ms
    public static PASSWORD_VALIDATOR_MESSAGE = dedent`Password is too weak, please use this rules:
        At least one digit [0-9]
        At least one lowercase character [a-z]
        At least one uppercase character [A-Z]
        At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
        At least 8 characters in length, but no more than 32.`;

    private static CONSUMER_TOKEN_PROP = "isConsumerToken";

    async authenticate(tokenPayload, token): Promise<UserDto> {
        // Find the user associated with the email provided by the user
        const user = await userRepository.getUserWithSecretsByEmail(tokenPayload.email.toLocaleLowerCase());
        if (!user) throw new NotFoundError("User not found", UserServiceErrors.USER_NOT_FOUND);

        if (!tokenPayload[UserService.CONSUMER_TOKEN_PROP]) {
            if (!user.active) throw new ForbiddenError("User is not active", UserServiceErrors.USER_NOT_ACTIVE);

            if (new Date(tokenPayload.now).getTime() + JWT_EXPIRES_TIME < Date.now())
                throw new UnauthorizedError(
                    "JWT has expired, please login try again",
                    UserServiceErrors.LOGIN_UPDATE_JWT_FAIL
                );

            if (user.jwt?.token !== token)
                throw new UnauthorizedError(
                    "JWT has expired, please login try again",
                    UserServiceErrors.LOGIN_UPDATE_JWT_FAIL
                );
        }
        return userRepository.removeSecrets(user) as UserDto;
    }

    async login(email: string, password: string): Promise<Omit<UserDbo, "hashPassword">> {
        const user = await userRepository.getUserWithSecretsByEmail(email.toLocaleLowerCase());

        if (!user) throw new NotFoundError("User not found", LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);
        if (!user.active) throw new UnauthorizedError("User is not active", LoginDtoErrorCodes.USER_NOT_ACTIVE);

        const validPassword = await bcrypt.compare(password, user.hashPassword);
        if (!validPassword)
            throw new UnauthorizedError("Password does not match", LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);

        const updateJwt = async () => {
            // Generate new JTW Token
            const now = new Date();

            const updatedJwt = {
                token: this.buildJWTToken(user as unknown as DefaultObject),
                expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME)
            };

            try {
                user.jwt = updatedJwt;
                await userRepository.update(user);
            } catch (e) {
                throw new InternalServerError(UserUpdateError.message, UserServiceErrors.LOGIN_UPDATE_JWT_FAIL);
            }
        };

        if (!user.jwt) await updateJwt();
        else {
            const tokenPayload = jwt.verify(user.jwt.token, JWT_SECRET) as jwt.JwtPayload;
            if (new Date(tokenPayload.now).getTime() + JWT_EXPIRES_TIME < Date.now()) await updateJwt();
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    public async logout(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email.toLocaleLowerCase());

        if (!userWithSecrets?.jwt) {
            // No jwt, so user is already disconnected
            return user;
        }

        return userRepository.update({ ...user, jwt: null });
    }

    findByEmail(email: string) {
        return userRepository.findByEmail(email.toLocaleLowerCase());
    }

    findConsumerToken(userId: ObjectId) {
        return consumerTokenRepository.findToken(userId);
    }

    find(query: DefaultObject = {}) {
        return userRepository.find(query);
    }

    async createConsumer(email: string) {
        const createResult = await this.createUser(email, [RoleEnum.user, RoleEnum.consumer]);
        if (!createResult?.success) return createResult;
        const user = createResult.user;
        const token = this.buildJWTToken({ ...user, [UserService.CONSUMER_TOKEN_PROP]: true }, { expiration: false });
        try {
            await consumerTokenRepository.create(new ConsumerToken(user._id, token));
            return { success: true, user };
        } catch (e) {
            return {
                success: false,
                message: "Could not create consumer token",
                code: UserServiceErrors.CREATE_CONSUMER_TOKEN
            };
        }
    }

    async createUser(
        email: string,
        roles: RoleEnum[] = [RoleEnum.user],
        password = "TMP_PASSWOrd;12345678"
    ): Promise<UserServiceError | { success: true; user: UserDto }> {
        await this.validateEmailAndPassword(email.toLocaleLowerCase(), password);

        const partialUser = {
            email: email.toLocaleLowerCase(),
            hashPassword: await bcrypt.hash(password, 10),
            signupAt: new Date(),
            roles
        };

        if (!this.validRoles(roles))
            return {
                success: false,
                message: "Given user role does not exist",
                code: UserServiceErrors.ROLE_NOT_FOUND
            };

        const now = new Date();
        const jwtParams = {
            token: this.buildJWTToken(partialUser),
            expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME)
        };

        const stats = {
            searchCount: 0,
            lastSearchDate: null
        };

        const user = new UserNotPersisted({
            ...partialUser,
            jwt: jwtParams,
            active: false,
            stats
        });

        const createdUser = await userRepository.create(user);

        if (!createdUser) {
            return {
                success: false,
                message: "The user could not be created",
                code: UserServiceErrors.CREATE_USER_WRONG
            };
        }

        return { success: true, user: createdUser };
    }

    public async updatePassword(
        user: UserDto,
        password: string
    ): Promise<UserServiceError | { success: true; user: UserDto }> {
        if (!this.passwordValidator(password)) {
            return {
                success: false,
                message: UserService.PASSWORD_VALIDATOR_MESSAGE,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            };
        }

        return {
            success: true,
            user: await userRepository.update({
                ...user,
                hashPassword: await bcrypt.hash(password, 10),
                active: true
            })
        };
    }

    public async update(user: UserDto): Promise<UserDto> {
        await this.validateEmail(user.email);
        return await userRepository.update(user);
    }

    public async delete(userId: string): Promise<{ success: boolean }> {
        const user = await userRepository.findById(userId);

        if (!user) return { success: false };

        return { success: await userRepository.delete(user) };
    }

    public async addUsersByCsv(content: Buffer) {
        const data = content
            .toString()
            .split("\n") // Select line by line
            .map(raw =>
                raw
                    .split(";")
                    .map(r => r.split("\t"))
                    .flat()
            ); // Parse column
        const emails = data.map(line => line[0]).filter(email => email.length);

        return this.createUsersByList(emails);
    }

    public async createUsersByList(emails: string[]) {
        return emails.reduce(async (acc, email) => {
            const data = await acc;
            const result = await this.signup(email.toLocaleLowerCase());
            return Promise.resolve([...data, { email, ...result }]);
        }, Promise.resolve([]) as Promise<({ success: true; email: string } | UserServiceError)[]>);
    }

    public async signup(
        email: string,
        role = RoleEnum.user
    ): Promise<UserServiceError | { success: true; email: string }> {
        let result;
        const lowerCaseEmail = email.toLocaleLowerCase();
        if (role == RoleEnum.consumer) {
            result = await this.createConsumer(lowerCaseEmail);
        } else {
            result = await this.createUser(lowerCaseEmail);
        }

        if (!result.success) return { success: false, message: result.message, code: result.code };

        const resetResult = await this.resetUser(result.user);

        if (!resetResult.success)
            return {
                success: false,
                message: resetResult.message,
                code: resetResult.code
            };

        await mailNotifierService.sendCreationMail(lowerCaseEmail, resetResult.reset.token);

        return { email, success: true };
    }

    async addRolesToUser(
        user: UserDto | string,
        roles: RoleEnum[]
    ): Promise<{ success: true; user: UserDto } | UserServiceError> {
        if (typeof user === "string") {
            const foundUser = await userRepository.findByEmail(user);
            if (!foundUser) {
                return {
                    success: false,
                    message: "User email does not correspond to a user",
                    code: UserServiceErrors.USER_NOT_FOUND
                };
            }
            user = foundUser;
        }

        if (!roles.every(role => Object.values(RoleEnum).includes(role))) {
            return {
                success: false,
                message: `The role "${roles.find(role => !Object.values(RoleEnum).includes(role))}" does not exist`,
                code: UserServiceErrors.ROLE_NOT_FOUND
            };
        }

        user.roles = [...new Set([...user.roles, ...roles])];
        return { success: true, user: await userRepository.update(user) };
    }

    async activeUser(user: UserDto | string): Promise<UserServiceError | { success: true; user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userRepository.findByEmail(user);
            if (!foundUser) {
                return {
                    success: false,
                    message: "User email does not correspond to a user",
                    code: UserServiceErrors.USER_NOT_FOUND
                };
            }
            user = foundUser;
        }

        user.active = true;

        return { success: true, user: await userRepository.update(user) };
    }

    async refreshExpirationToken(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email);
        if (!userWithSecrets?.jwt) {
            return {
                success: false,
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update(userWithSecrets);
    }

    async resetPassword(
        password: string,
        resetToken: string
    ): Promise<UserServiceError | { success: true; user: UserDto }> {
        const reset = await userResetRepository.findByToken(resetToken);

        if (!reset) {
            return {
                success: false,
                message: "Reset token not found",
                code: UserServiceErrors.RESET_TOKEN_NOT_FOUND
            };
        }

        if (reset.createdAt.getTime() + UserService.RESET_TIMEOUT < Date.now()) {
            return {
                success: false,
                message: "Reset token has expired, please retry forget password",
                code: UserServiceErrors.RESET_TOKEN_EXPIRED
            };
        }

        const user = await userRepository.findById(reset.userId);

        if (!user) {
            return {
                success: false,
                message: "User not found",
                code: UserServiceErrors.USER_NOT_FOUND
            };
        }

        if (!this.passwordValidator(password)) {
            return {
                success: false,
                message: `Password is not hard, please use this rules:
                        At least one digit [0-9]
                        At least one lowercase character [a-z]
                        At least one uppercase character [A-Z]
                        At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
                        At least 8 characters in length, but no more than 32.
                    `,
                code: UserServiceErrors.FORMAT_PASSWORD_INVALID
            };
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await userResetRepository.remove(reset);

        return {
            success: true,
            user: await userRepository.update({
                ...user,
                hashPassword,
                active: true
            })
        };
    }

    async forgetPassword(email: string): Promise<UserServiceError | { success: true; reset: UserReset }> {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());
        if (!user) {
            return {
                success: false,
                message: "User not found",
                code: UserServiceErrors.USER_NOT_FOUND
            };
        }

        const resetResult = await this.resetUser(user);

        if (resetResult.success) {
            mailNotifierService.sendForgetPassword(email.toLocaleLowerCase(), resetResult.reset.token);
        }

        return resetResult;
    }

    async resetUser(user: UserDto): Promise<UserServiceError | { success: true; reset: UserReset }> {
        await userResetRepository.removeAllByUserId(user._id);

        const token = RandToken.generate(32);
        const reset = new UserReset(user._id, token, new Date());

        const createdReset = await userResetRepository.create(reset);

        if (!createdReset) {
            return {
                success: false,
                message: "The user reset password could not be created",
                code: UserServiceErrors.CREATE_RESET_PASSWORD_WRONG
            };
        }

        user.active = false;

        await userRepository.update(user);

        return { success: true, reset: createdReset };
    }

    // Only used in tests
    async findJwtByEmail(
        email: string
    ): Promise<UserServiceError | { success: true; jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(email.toLocaleLowerCase());
        if (!userWithSecrets) {
            return {
                success: false,
                message: "User not found",
                code: UserServiceErrors.USER_NOT_FOUND
            };
        }

        if (!userWithSecrets.jwt) {
            return {
                success: false,
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE
            };
        }

        return { success: true, jwt: userWithSecrets.jwt };
    }

    async findJwtByUser(user: UserDto) {
        const userDbo = await userRepository.getUserWithSecretsById(user._id);
        return userDbo?.jwt;
    }

    async findUserResetByUserId(userId: ObjectId) {
        return userResetRepository.findByUserId(userId);
    }

    private passwordValidator(password: string): boolean {
        return REGEX_PASSWORD.test(password);
    }

    public getRoles(user: UserDto) {
        return user.roles;
    }

    public async listUsers(): Promise<{ success: true; users: UserWithResetTokenDto[] }> {
        const users = (await userRepository.find()).filter(user => user) as UserDto[];
        return {
            success: true,
            users: await Promise.all(
                users.map(async user => {
                    const reset = await userResetRepository.findByUserId(user._id);
                    return {
                        ...user,
                        _id: user._id.toString(),
                        resetToken: reset?.token,
                        resetTokenDate: reset?.createdAt
                    } as UserWithResetTokenDto;
                })
            )
        };
    }

    private async validateEmailAndPassword(email: string, password: string): Promise<void> {
        await this.validateEmail(email);

        if (await userRepository.findByEmail(email.toLocaleLowerCase()))
            throw new ConflictError("User is already exist", UserServiceErrors.CREATE_USER_ALREADY_EXIST);

        if (!this.passwordValidator(password))
            throw new BadRequestError(
                UserService.PASSWORD_VALIDATOR_MESSAGE,
                UserServiceErrors.FORMAT_PASSWORD_INVALID
            );
    }

    public isRoleValid(role: RoleEnum) {
        return Object.values(RoleEnum).includes(role);
    }

    private validRoles(roles: RoleEnum[]) {
        return roles.every(role => this.isRoleValid(role));
    }

    private async validateEmail(email: string): Promise<void> {
        if (!REGEX_MAIL.test(email)) {
            throw new BadRequestError("Email is not valid", UserServiceErrors.CREATE_INVALID_EMAIL);
        }

        if (!(await configurationsService.isDomainAccepted(email))) {
            throw new BadRequestError("Email domain is not accepted", UserServiceErrors.CREATE_EMAIL_GOUV);
        }
    }

    private buildJWTToken(user: DefaultObject, options: { expiration: boolean } = { expiration: true }) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { jwt: jwtSubObject, ...userWithoutToken } = user;
        const jwtContent = { ...userWithoutToken, now: new Date() };
        const jwtOption: jwt.SignOptions = {};

        if (options.expiration) {
            jwtOption.expiresIn = JWT_EXPIRES_TIME;
        }

        return jwt.sign(jwtContent, JWT_SECRET, jwtOption);
    }

    public findByPeriod(begin: Date, end: Date, withAdmin = false) {
        return userRepository.findByPeriod(begin, end, withAdmin);
    }

    public countTotalUsersOnDate(date, withAdmin = false) {
        return userRepository.countTotalUsersOnDate(date, withAdmin);
    }
}

const userService = new UserService();

export default userService;
