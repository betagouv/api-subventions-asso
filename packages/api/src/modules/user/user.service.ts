import UserDto, { UserWithResetTokenDto } from "@api-subventions-asso/dto/user/UserDto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import * as RandToken from "rand-token";
import dedent from "dedent";
import { LoginDtoErrorCodes, ResetPasswordErrorCodes, UserErrorCodes } from "@api-subventions-asso/dto";
import { RoleEnum } from "../../@enums/Roles";
import { DefaultObject } from "../../@types";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../configurations/jwt.conf";
import mailNotifierService from "../mail-notifier/mail-notifier.service";
import configurationsService from "../configurations/configurations.service";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from "../../shared/errors/httpErrors";
import { ConsumerToken } from "./entities/ConsumerToken";
import consumerTokenRepository from "./repositories/consumer-token.repository";
import { UserUpdateError } from "./repositories/errors/UserUpdateError";
import userResetRepository from "./repositories/user-reset.repository";
import UserNotPersisted from "./entities/UserNotPersisted";
import UserReset from "./entities/UserReset";
import UserDbo from "./repositories/dbo/UserDbo";

import userRepository from "./repositories/user.repository";
import { REGEX_MAIL, REGEX_PASSWORD } from "./user.constant";

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

    async findConsumerToken(userId: ObjectId): Promise<string> {
        const token = await consumerTokenRepository.findToken(userId);
        if (!token) {
            throw new NotFoundError("Aucun token d'authentification n'a été trouvé");
        }
        return token;
    }

    find(query: DefaultObject = {}) {
        return userRepository.find(query);
    }

    async createConsumer(email: string) {
        const user = await this.createUser(email, [RoleEnum.user, RoleEnum.consumer]);
        const token = this.buildJWTToken({ ...user, [UserService.CONSUMER_TOKEN_PROP]: true }, { expiration: false });
        try {
            await consumerTokenRepository.create(new ConsumerToken(user._id, token));
            return user;
        } catch (e) {
            throw new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN);
        }
    }

    async createUser(
        email: string,
        roles: RoleEnum[] = [RoleEnum.user],
        password = "TMP_PASSWOrd;12345678"
    ): Promise<UserDto> {
        await this.validateEmailAndPassword(email.toLocaleLowerCase(), password);

        const partialUser = {
            email: email.toLocaleLowerCase(),
            hashPassword: await bcrypt.hash(password, 10),
            signupAt: new Date(),
            roles
        };

        if (!this.validRoles(roles))
            throw new BadRequestError("Given user role does not exist", UserServiceErrors.ROLE_NOT_FOUND);

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

        if (!createdUser)
            throw new InternalServerError("The user could not be created", UserServiceErrors.CREATE_USER_WRONG);

        return createdUser;
    }

    public async updatePassword(user: UserDto, password: string): Promise<{ user: UserDto }> {
        if (!this.passwordValidator(password)) {
            throw new BadRequestError(UserService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD);
        }

        return {
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

    public async delete(userId: string): Promise<boolean> {
        const user = await userRepository.findById(userId);

        if (!user) return false;

        return await userRepository.delete(user);
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
        const promises = emails.map(email => this.signup(email.toLocaleLowerCase()).catch(() => null));
        return (await Promise.all(promises)).filter(result => result != null);
    }

    public async signup(email: string, role = RoleEnum.user): Promise<string> {
        let user;
        const lowerCaseEmail = email.toLocaleLowerCase();
        if (role == RoleEnum.consumer) {
            user = await this.createConsumer(lowerCaseEmail);
        } else {
            user = await this.createUser(lowerCaseEmail);
        }

        const resetResult = await this.resetUser(user);

        await mailNotifierService.sendCreationMail(lowerCaseEmail, resetResult.token);

        return email;
    }

    async addRolesToUser(user: UserDto | string, roles: RoleEnum[]): Promise<{ user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userRepository.findByEmail(user);
            if (!foundUser) {
                throw new NotFoundError("User Not Found", UserServiceErrors.USER_NOT_FOUND);
            }
            user = foundUser;
        }

        const roleEnumValues = Object.values(RoleEnum);
        const invalidRole = roles.find(role => !roleEnumValues.includes(role));
        if (invalidRole) {
            throw new BadRequestError(`Role ${invalidRole} is not valid`, UserServiceErrors.ROLE_NOT_FOUND);
        }

        user.roles = [...new Set([...user.roles, ...roles])];

        return { user: await userRepository.update(user) };
    }

    async activeUser(user: UserDto | string): Promise<UserServiceError | { user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userRepository.findByEmail(user);
            if (!foundUser) {
                throw new NotFoundError("User email does not correspond to a user");
            }
            user = foundUser;
        }

        user.active = true;

        return { user: await userRepository.update(user) };
    }

    async refreshExpirationToken(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email);
        if (!userWithSecrets?.jwt) {
            return {
                message: "User is not active",
                code: UserServiceErrors.USER_NOT_ACTIVE
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update(userWithSecrets);
    }

    async resetPassword(password: string, resetToken: string): Promise<UserDto> {
        const reset = await userResetRepository.findByToken(resetToken);

        if (!reset) throw new NotFoundError("Reset token not found", ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND);

        if (reset.createdAt.getTime() + UserService.RESET_TIMEOUT < Date.now())
            throw new BadRequestError(
                "Reset token has expired, please retry forget password",
                ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED
            );

        const user = await userRepository.findById(reset.userId);

        if (!user) throw new NotFoundError("User not found", ResetPasswordErrorCodes.USER_NOT_FOUND);

        if (!this.passwordValidator(password))
            throw new BadRequestError(
                UserService.PASSWORD_VALIDATOR_MESSAGE,
                ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID
            );

        const hashPassword = await bcrypt.hash(password, 10);

        await userResetRepository.remove(reset);

        return await userRepository.update({
            ...user,
            hashPassword,
            active: true
        });
    }

    async forgetPassword(email: string): Promise<UserReset> {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());
        if (!user) throw new NotFoundError("User not found", UserServiceErrors.USER_NOT_FOUND);

        const resetResult = await this.resetUser(user);

        mailNotifierService.sendForgetPasswordMail(email.toLocaleLowerCase(), resetResult.token);

        return resetResult;
    }

    async resetUser(user: UserDto): Promise<UserReset> {
        await userResetRepository.removeAllByUserId(user._id);

        const token = RandToken.generate(32);
        const reset = new UserReset(user._id, token, new Date());

        const createdReset = await userResetRepository.create(reset);

        if (!createdReset) {
            throw new InternalServerError(
                "The user reset password could not be created",
                UserServiceErrors.CREATE_RESET_PASSWORD_WRONG
            );
        }

        user.active = false;

        await userRepository.update(user);

        return createdReset;
    }

    // Only used in tests
    async findJwtByEmail(email: string): Promise<{ jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(email.toLocaleLowerCase());
        if (!userWithSecrets) {
            throw new Error("User not found");
        }

        if (!userWithSecrets.jwt) {
            throw new Error("User is not active");
        }

        return { jwt: userWithSecrets.jwt };
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

    public async listUsers(): Promise<{ users: UserWithResetTokenDto[] }> {
        const users = (await userRepository.find()).filter(user => user) as UserDto[];
        return {
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
