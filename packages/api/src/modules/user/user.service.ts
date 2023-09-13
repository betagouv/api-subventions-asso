import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import * as RandToken from "rand-token";
import dedent from "dedent";
import {
    LoginDtoErrorCodes,
    ResetPasswordErrorCodes,
    SignupErrorCodes,
    UserErrorCodes,
    UserWithResetTokenDto,
    UserDto,
    UserWithStatsDto,
    FutureUserDto,
    UserDataDto,
    TokenValidationDtoResponse,
    TokenValidationType,
    UserActivationInfoDto,
    AgentTypeEnum,
    AgentJobTypeEnum,
    TerritorialScopeEnum,
    AdminTerritorialLevel,
} from "dto";
import { RoleEnum } from "../../@enums/Roles";
import { DefaultObject } from "../../@types";
import { JWT_EXPIRES_TIME, JWT_SECRET } from "../../configurations/jwt.conf";
import configurationsService from "../configurations/configurations.service";
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
    UserNotFoundError,
    ResetTokenNotFoundError,
} from "../../shared/errors/httpErrors";
import { NotificationType } from "../notify/@types/NotificationType";
import notifyService from "../notify/notify.service";
import userAssociationVisitJoiner from "../stats/joiners/UserAssociationVisitsJoiner";
import { getMostRecentDate } from "../../shared/helpers/DateHelper";
import { removeSecrets, uniformizeId } from "../../shared/helpers/RepositoryHelper";
import { isInObjectValues } from "../../shared/Validators";
import LoginError from "../../shared/errors/LoginError";
import { sanitizeToPlainText } from "../../shared/helpers/StringHelper";
import statsService from "../stats/stats.service";
import { FRONT_OFFICE_URL } from "../../configurations/front.conf";
import { joinEnum } from "../../shared/helpers/ArrayHelper";
import { ConsumerToken } from "./entities/ConsumerToken";
import consumerTokenRepository from "./repositories/consumer-token.repository";
import { UserUpdateError } from "./repositories/errors/UserUpdateError";
import userResetRepository from "./repositories/user-reset.repository";
import UserReset from "./entities/UserReset";
import UserDbo, { UserNotPersisted } from "./repositories/dbo/UserDbo";

import userRepository from "./repositories/user.repository";
import { REGEX_MAIL, REGEX_PASSWORD, DEFAULT_PWD } from "./user.constant";

export enum UserServiceErrors {
    LOGIN_WRONG_PASSWORD_MATCH,
    LOGIN_UPDATE_JWT_FAIL,
    USER_NOT_ACTIVE,
    CREATE_INVALID_EMAIL,
    CREATE_USER_ALREADY_EXISTS,
    CREATE_USER_WRONG,
    FORMAT_PASSWORD_INVALID,
    USER_NOT_FOUND,
    ROLE_NOT_FOUND,
    RESET_TOKEN_NOT_FOUND,
    RESET_TOKEN_EXPIRED,
    CREATE_RESET_PASSWORD_WRONG,
    CREATE_EMAIL_GOUV,
    CREATE_CONSUMER_TOKEN,
    USER_TOKEN_EXPIRED,
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

    private async getHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async authenticate(tokenPayload, token): Promise<UserDto> {
        // Find the user associated with the email provided by the user
        const user = await userRepository.getUserWithSecretsByEmail(tokenPayload.email);
        if (!user) throw new NotFoundError("User not found", UserServiceErrors.USER_NOT_FOUND);

        if (!tokenPayload[UserService.CONSUMER_TOKEN_PROP]) {
            if (!user.active) throw new ForbiddenError("User is not active", UserServiceErrors.USER_NOT_ACTIVE);

            if (new Date(tokenPayload.now).getTime() + JWT_EXPIRES_TIME < Date.now())
                throw new UnauthorizedError(
                    "JWT has expired, please login try again",
                    UserServiceErrors.LOGIN_UPDATE_JWT_FAIL,
                );

            if (user.jwt?.token !== token)
                throw new UnauthorizedError(
                    "JWT has expired, please login try again",
                    UserServiceErrors.LOGIN_UPDATE_JWT_FAIL,
                );
        }
        return removeSecrets(user) as UserDto;
    }

    async login(email: string, password: string): Promise<Omit<UserDbo, "hashPassword">> {
        const user = await userRepository.getUserWithSecretsByEmail(email);

        if (!user) throw new LoginError();
        const validPassword = await bcrypt.compare(password, user.hashPassword);
        if (!validPassword) throw new LoginError();
        if (!user.active) throw new UnauthorizedError("User is not active", LoginDtoErrorCodes.USER_NOT_ACTIVE);

        const updateJwt = async () => {
            // Generate new JTW Token
            const now = new Date();

            const updatedJwt = {
                token: this.buildJWTToken(user as unknown as DefaultObject),
                expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME),
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

        notifyService.notify(NotificationType.USER_LOGGED, {
            email,
            date: new Date(),
        });

        const { hashPassword: _hashPwd, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    public async logout(user: UserDto) {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(user.email);

        if (!userWithSecrets?.jwt) {
            // No jwt, so user is already disconnected
            return user;
        }

        return userRepository.update({ ...user, jwt: null });
    }

    findByEmail(email: string) {
        return userRepository.findByEmail(email);
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

    async createConsumer(userObject) {
        const user = await this.createUser({ ...userObject, roles: [RoleEnum.user, RoleEnum.consumer] });
        const consumerToken = this.buildJWTToken(
            { ...user, [UserService.CONSUMER_TOKEN_PROP]: true },
            { expiration: false },
        );
        try {
            await consumerTokenRepository.create(new ConsumerToken(user._id, consumerToken));
            return user;
        } catch (e) {
            await this.delete(user._id.toString());
            throw new InternalServerError("Could not create consumer token", UserServiceErrors.CREATE_CONSUMER_TOKEN);
        }
    }

    /**
     * validates and sanitizes in-place user. if newUser: check if no email duplicate
     * @param user
     * @param newUser
     */
    async validateSanitizeUser(user: FutureUserDto, newUser = true) {
        await this.validateEmail(user.email);

        if (newUser && (await userRepository.findByEmail(user.email)))
            throw new InternalServerError("An error has occurred");

        if (!this.validRoles(user.roles || []))
            throw new BadRequestError("Given user role does not exist", UserServiceErrors.ROLE_NOT_FOUND);

        if (user.firstName) user.firstName = sanitizeToPlainText(user.firstName?.toString());
        if (user.lastName) user.lastName = sanitizeToPlainText(user.lastName?.toString());
    }

    async createUser(userObject: FutureUserDto): Promise<UserDto> {
        // default values and ensures format
        if (!userObject.roles) userObject.roles = [RoleEnum.user];

        await this.validateSanitizeUser(userObject);

        const partialUser: Record<string, unknown> = {
            email: userObject.email,
            hashPassword: await this.getHashPassword(DEFAULT_PWD),
            signupAt: new Date(),
            roles: userObject.roles,
            firstName: userObject.firstName || null,
            lastName: userObject.lastName || null,
            profileToComplete: true,
        };

        const now = new Date();
        const jwtParams = {
            token: this.buildJWTToken(partialUser),
            expirateDate: new Date(now.getTime() + JWT_EXPIRES_TIME),
        };

        const user = {
            ...partialUser,
            jwt: jwtParams,
            active: false,
        } as UserNotPersisted;

        const createdUser = await userRepository.create(user);

        if (!createdUser)
            throw new InternalServerError("The user could not be created", UserServiceErrors.CREATE_USER_WRONG);

        return createdUser;
    }

    public async updatePassword(user: UserDto, password: string): Promise<{ user: UserDto }> {
        if (!this.passwordValidator(password)) {
            throw new BadRequestError(UserService.PASSWORD_VALIDATOR_MESSAGE, UserErrorCodes.INVALID_PASSWORD);
        }

        const userUpdated = await userRepository.update({
            ...user,
            hashPassword: await this.getHashPassword(password),
            active: true,
        });

        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });

        return { user: userUpdated };
    }

    public async update(user: UserDto): Promise<UserDto> {
        await this.validateEmail(user.email);
        return await userRepository.update(user);
    }

    public async delete(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);

        if (!user) return false;

        if (!(await userRepository.delete(user))) return false;

        const deletePromises = [
            userResetRepository.removeAllByUserId(user._id),
            consumerTokenRepository.deleteAllByUserId(user._id),
        ];

        notifyService.notify(NotificationType.USER_DELETED, {
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
        });

        return (await Promise.all(deletePromises)).every(success => success);
    }

    public async signup(userObject: FutureUserDto, role = RoleEnum.user): Promise<UserDto> {
        userObject.roles = [role];

        let user;
        if (role == RoleEnum.consumer) {
            user = await this.createConsumer(userObject);
        } else {
            try {
                user = await this.createUser(userObject);
            } catch (e) {
                if (e instanceof BadRequestError && e.code === UserServiceErrors.CREATE_EMAIL_GOUV)
                    throw new BadRequestError(e.message, SignupErrorCodes.EMAIL_MUST_BE_END_GOUV);
                throw e;
            }
        }

        const resetResult = await this.resetUser(user);

        notifyService.notify(NotificationType.USER_CREATED, {
            email: userObject.email,
            firstname: userObject.firstName,
            lastname: userObject.lastName,
            url: `${FRONT_OFFICE_URL}/auth/activate/${resetResult.token}`,
            active: user.active,
            signupAt: user.signupAt,
        });

        return user;
    }

    sanitizeActivationUserInfo(unsafeUserInfo) {
        const filedToSanitize = ["service", "phoneNumber", "structure", "decentralizedTerritory"];
        const sanitizedUserInfo = { ...unsafeUserInfo };
        filedToSanitize.forEach(field => {
            sanitizedUserInfo[field] = sanitizeToPlainText(unsafeUserInfo[field]);
        });
        return sanitizedUserInfo;
    }

    public getUserById(userId) {
        return userRepository.findById(userId);
    }

    public async activate(resetToken: string, userInfo: UserActivationInfoDto): Promise<UserDto> {
        const userReset = await userResetRepository.findByToken(resetToken);

        const tokenValidation = this.validateResetToken(userReset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await this.getUserById((userReset as UserReset).userId);
        if (!user) throw new UserNotFoundError();

        if (!userInfo.jobType) userInfo.jobType = [];

        const userInfoValidation = this.validateUserActivationInfo(userInfo);
        if (!userInfoValidation.valid) throw userInfoValidation.error;

        const safeUserInfo = this.sanitizeActivationUserInfo(userInfo);
        safeUserInfo.hashPassword = await this.getHashPassword(safeUserInfo.password);
        delete safeUserInfo.password;
        const updatedUser = await userRepository.update({ ...user, ...safeUserInfo });
        console.log(updatedUser);
        // @ts-expect-error: TODO prob with DTO
        delete updatedUser.hashPassword;
        return updatedUser;
    }

    private validateUserActivationInfo(userInfo): { valid: false; error: Error } | { valid: true } {
        const { password, agentType, jobType, structure } = userInfo;
        const validations = [
            {
                value: password,
                method: this.passwordValidator,
                error: new BadRequestError(
                    UserService.PASSWORD_VALIDATOR_MESSAGE,
                    ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
                ),
            },
            {
                value: agentType,
                method: value => isInObjectValues(AgentTypeEnum, value),
                error: new BadRequestError(dedent`Mauvaise valeur pour le type d'agent.
                    Les valeurs possibles sont ${joinEnum(AgentTypeEnum)}
                `),
            },
            {
                value: jobType,
                method: jobType => {
                    if (jobType.length === 0) return true;
                    return !jobType.find(type => !isInObjectValues(AgentJobTypeEnum, type));
                },
                error: new BadRequestError(dedent`Mauvaise valeur pour le type de poste.
                    Les valeurs possibles sont ${joinEnum(AgentJobTypeEnum)}
                `),
            },
        ];

        /**
         *          AGENT TYPE SPECIFIC VALUES
         */

        if (structure) {
            validations.push({
                value: structure,
                method: value => typeof value == "string",
                error: new BadRequestError(dedent`Mauvaise valeur pour la structure.`),
            });
        }

        if (agentType === AgentTypeEnum.TERRITORIAL_COLLECTIVITY)
            validations.push({
                value: userInfo.territorialScope,
                method: value => isInObjectValues(TerritorialScopeEnum, value),
                error: new BadRequestError(dedent`Mauvaise valeur pour le périmètre
                Les valeurs possibles sont ${joinEnum(TerritorialScopeEnum)}`),
            });

        if (agentType === AgentTypeEnum.DECONCENTRATED_ADMIN)
            validations.push({
                value: userInfo.decentralizedLevel,
                method: value => isInObjectValues(AdminTerritorialLevel, value),
                error: new BadRequestError(dedent`Mauvaise valeur pour le niveau territorial
                Les valeurs possibles sont ${joinEnum(AdminTerritorialLevel)}`),
            });

        let error: Error | undefined;
        for (const validation of validations) {
            if (!validation.method(validation.value)) {
                error = validation.error;
                break;
            }
        }
        return error ? { valid: false, error: error as BadRequestError } : { valid: true };
    }

    public async disable(userId: string) {
        const user = await this.getUserById(userId);
        if (!user) return false;
        // Anonymize the user when it is being deleted to keep use stats consistent
        // It keeps roles and signupAt in place to avoid breaking any stats
        const disabledUser = {
            ...user,
            active: false,
            email: "",
            jwt: null,
            hashPassword: "",
            disable: true,
            firstName: "",
            lastName: "",
        };

        notifyService.notify(NotificationType.USER_DELETED, { email: user.email });

        return !!(await userRepository.update(disabledUser));
    }

    async addRolesToUser(user: UserDto | string, roles: RoleEnum[]): Promise<{ user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userRepository.findByEmail(user);
            if (!foundUser) {
                throw new InternalServerError("An error has occurred");
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
                code: UserServiceErrors.USER_NOT_ACTIVE,
            };
        }

        userWithSecrets.jwt.expirateDate = new Date(Date.now() + JWT_EXPIRES_TIME);

        return await userRepository.update(userWithSecrets);
    }

    private isExpiredReset(reset: UserReset) {
        return reset.createdAt.getTime() + UserService.RESET_TIMEOUT < Date.now();
    }

    private validateResetToken(userReset: UserReset | null): { valid: false; error: Error } | { valid: true } {
        let error: Error | null = null;
        if (!userReset) error = new ResetTokenNotFoundError();
        else if (this.isExpiredReset(userReset as UserReset))
            error = new BadRequestError(
                "Reset token has expired, please retry forget password",
                ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED,
            );

        return error ? { valid: false, error } : { valid: true };
    }

    async validateTokenAndGetType(resetToken: string): Promise<TokenValidationDtoResponse> {
        const reset = await userResetRepository.findByToken(resetToken);
        const tokenValidation = this.validateResetToken(reset);
        console.log(tokenValidation);
        if (!tokenValidation.valid) return tokenValidation;

        const user = await this.getUserById((reset as UserReset).userId);
        if (!user) return { valid: false };

        return {
            ...tokenValidation,
            type: user.profileToComplete ? TokenValidationType.SIGNUP : TokenValidationType.FORGET_PASSWORD,
        };
    }

    async resetPassword(password: string, resetToken: string): Promise<UserDto> {
        const reset = await userResetRepository.findByToken(resetToken);

        // TODO: validate reset token
        const tokenValidation = this.validateResetToken(reset);
        if (!tokenValidation.valid) throw tokenValidation.error;

        const user = await this.getUserById((reset as UserReset).userId);
        if (!user) throw new UserNotFoundError();

        if (!this.passwordValidator(password))
            throw new BadRequestError(
                UserService.PASSWORD_VALIDATOR_MESSAGE,
                ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID,
            );

        const hashPassword = await this.getHashPassword(password);

        await userResetRepository.remove(reset as UserReset);

        notifyService.notify(NotificationType.USER_ACTIVATED, { email: user.email });

        const userUpdated = await userRepository.update({
            ...user,
            hashPassword,
            active: true,
            profileToComplete: false,
        });

        // @ts-expect-error: TODO prob with DTO
        delete userUpdated.hashPassword;
        return userUpdated;
    }

    async forgetPassword(email: string) {
        const user = await userRepository.findByEmail(email.toLocaleLowerCase());
        if (!user) return; // Don't say user not found, for security reasons

        const resetResult = await this.resetUser(user);

        notifyService.notify(NotificationType.USER_FORGET_PASSWORD, {
            email: email.toLocaleLowerCase(),
            url: `${FRONT_OFFICE_URL}/auth/reset-password/${resetResult.token}`,
        });
    }

    async resetUser(user: UserDto): Promise<UserReset> {
        await userResetRepository.removeAllByUserId(user._id);

        const token = RandToken.generate(32);
        const reset = new UserReset(user._id, token, new Date());

        const createdReset = await userResetRepository.create(reset);

        if (!createdReset) {
            throw new InternalServerError(
                "The user reset password could not be created",
                UserServiceErrors.CREATE_RESET_PASSWORD_WRONG,
            );
        }

        user.active = false;

        await userRepository.update(user);

        return createdReset;
    }

    // Only used in tests
    async findJwtByEmail(email: string): Promise<{ jwt: { token: string; expirateDate: Date } }> {
        const userWithSecrets = await userRepository.getUserWithSecretsByEmail(email);
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
        return userResetRepository.findOneByUserId(userId);
    }

    private passwordValidator(password: string): boolean {
        return REGEX_PASSWORD.test(password);
    }

    public getRoles(user: UserDto) {
        return user.roles;
    }

    public async getUsersWithStats(includesAdmin = false): Promise<UserWithStatsDto[]> {
        const usersWithAssociationVisits = await userAssociationVisitJoiner.findUsersWithAssociationVisits(
            includesAdmin,
        );
        const userWithStats = usersWithAssociationVisits.map(user => {
            const stats = {
                lastSearchDate: getMostRecentDate(user.associationVisits.map(visit => visit.date)),
                searchCount: user.associationVisits.length,
            };
            // remove associationVisits
            const { associationVisits: _associationVisits, ...userDbo } = user;
            return { ...userDbo, stats } as UserWithStatsDto;
        });

        return userWithStats;
    }

    public async listUsers(): Promise<UserWithResetTokenDto[]> {
        const users = await this.getUsersWithStats(true);
        return await Promise.all(
            users.map(async user => {
                const reset = await userResetRepository.findOneByUserId(user._id);
                return {
                    ...user,
                    resetToken: reset?.token,
                    resetTokenDate: reset?.createdAt,
                };
            }),
        );
    }

    public isRoleValid(role: string) {
        return Object.values(RoleEnum).includes(role as RoleEnum);
    }

    private validRoles(roles: string[]) {
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

    public async getAllData(userId: string): Promise<UserDataDto> {
        const user = await this.getUserById(userId);

        if (!user) throw new NotFoundError("User is not found");

        const userIdToString = document => ({ ...document, userId: document.userId.toString() });

        const tokens = [
            ...(await userResetRepository.findByUserId(userId)),
            ...(await consumerTokenRepository.find(userId)),
        ]
            .map(uniformizeId)
            .map(userIdToString);

        const associationVisits = await statsService.getAllVisitsUser(userId);
        const userLogs = await statsService.getAllLogUser(user.email);

        return {
            user,
            tokens,
            logs: userLogs,
            statistics: {
                associationVisit: associationVisits.map(userIdToString),
            },
        };
    }

    async notifyAllUsersInSubTools() {
        const users = await userRepository.findAll();

        for (const user of users) {
            if (user.disable) continue;

            let reset: null | UserReset = null;
            if (!user.active) {
                reset = await userResetRepository.findOneByUserId(user._id);
            }

            const data = {
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                url: reset ? `${FRONT_OFFICE_URL}/auth/reset-password/${reset.token}?active=true` : undefined,
                active: user.active,
                signupAt: user.signupAt,
            };

            await notifyService.notify(NotificationType.USER_ALREADY_EXIST, data);
        }
    }
}

const userService = new UserService();

export default userService;
