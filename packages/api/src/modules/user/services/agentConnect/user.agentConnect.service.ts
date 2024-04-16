import { FutureUserDto, UpdatableUser, UserDto, UserWithJWTDto } from "dto";
import userRepository from "../../repositories/user.repository";
import userAuthService from "../auth/user.auth.service";
import notifyService from "../../../notify/notify.service";
import UserDbo from "../../repositories/dbo/UserDbo";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { AgentConnectUser } from "../../@types/AgentConnectUser";
import userCrudService from "../crud/user.crud.service";
import { RoleEnum } from "../../../../@enums/Roles";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import { BadRequestError, InternalServerError } from "../../../../shared/errors/httpErrors";
import { removeHashPassword, removeSecrets } from "../../../../shared/helpers/RepositoryHelper";
import configurationsService from "../../../configurations/configurations.service";
import { applyValidations, ValidationResult } from "../../../../shared/helpers/validation.helper";

export class UserAgentConnectService {
    async login(agentConnectUser: AgentConnectUser): Promise<UserWithJWTDto> {
        // TODO fix uid vs agentConnectID
        if (!agentConnectUser.email) throw new InternalServerError("nope");
        const userWithSecrets: UserDbo | null = await userRepository.getUserWithSecretsByEmail(agentConnectUser.email);
        const isNewUser = !userWithSecrets;

        let user: Omit<UserDbo, "hashPassword"> = isNewUser
            ? await this.createUserFromAgentConnect(agentConnectUser)
            : removeHashPassword(userWithSecrets);

        if (!isNewUser)
            user = {
                ...user,
                ...this.acUserToFutureUser(agentConnectUser),
                active: true,
            };

        user = await userAuthService.updateJwt(user);

        notifyService.notify(NotificationType.USER_LOGGED, { email: user.email, date: new Date() });
        if (!isNewUser) notifyService.notify(NotificationType.USER_UPDATED, removeSecrets(user));

        return user as UserWithJWTDto;
    }

    private acUserToFutureUser(agentConnectUser: AgentConnectUser): FutureUserDto {
        const firstName = agentConnectUser.given_name.split(" ")[0];
        return {
            email: agentConnectUser.email,
            firstName,
            lastName: agentConnectUser.usual_name,
            roles: [RoleEnum.user],
            agentConnectId: agentConnectUser.uid,
        };
    }

    async createUserFromAgentConnect(agentConnectUser: AgentConnectUser): Promise<Omit<UserDbo, "hashPassword">> {
        const userObject = this.acUserToFutureUser(agentConnectUser);

        const domain = userObject.email.match(/.*@(.*)/)?.[1];
        if (!domain) throw new InternalServerError("email from AgentConnect invalid");
        await configurationsService.addEmailDomain(domain);

        return userCrudService.createUser(userObject, true).catch(e => {
            if (e instanceof DuplicateIndexError) {
                // should not happen but caught for extra safety
                notifyService.notify(NotificationType.USER_CONFLICT, userObject);
                throw new InternalServerError("An error has occurred");
            }
            throw e;
        }) as Promise<Omit<UserDbo, "hashPassword">>;
    }

    /**
     * users linked to agentConnet cannot change all properties of their profile
     * @param user initial user data
     * @param data new user data to save
     */
    agentConnectUpdateValidations(user: UserDto, data: Partial<UpdatableUser>): ValidationResult {
        if (!user.agentConnectId) return { valid: true };
        return applyValidations([
            {
                value: data.firstName,
                method: (value: string | undefined | null) => value === undefined,
                error: new BadRequestError(
                    "Un utilisateur lié à AgentConnect ne peut pas changer de prénom sur l'application",
                ),
            },
            {
                value: data.lastName,
                method: (value: string | undefined | null) => value === undefined,
                error: new BadRequestError(
                    "Un utilisateur lié à AgentConnect ne peut pas changer de nom de famille sur l'application",
                ),
            },
        ]);
    }
}

const userAgentConnectService = new UserAgentConnectService();
export default userAgentConnectService;
