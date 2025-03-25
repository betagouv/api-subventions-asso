import { FutureUserDto, UpdatableUser, UserDto, UserWithJWTDto } from "dto";
import { Client, generators, Issuer, TokenSet } from "openid-client";
import { ObjectId } from "mongodb";
import { BadRequestError, InternalServerError } from "core";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import userPort from "../../../../dataProviders/db/user/user.port";
import userAuthService from "../auth/user.auth.service";
import notifyService from "../../../notify/notify.service";
import UserDbo from "../../../../dataProviders/db/user/UserDbo";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { AgentConnectUser } from "../../@types/AgentConnectUser";
import userCrudService from "../crud/user.crud.service";
import { RoleEnum } from "../../../../@enums/Roles";
import { removeHashPassword, removeSecrets } from "../../../../shared/helpers/PortHelper";
import configurationsService from "../../../configurations/configurations.service";
import { applyValidations, ValidationResult } from "../../../../shared/helpers/validation.helper";
import agentConnectTokenPort from "../../../../dataProviders/db/user/acToken.port";
import {
    AGENT_CONNECT_CLIENT_ID,
    AGENT_CONNECT_CLIENT_SECRET,
    AGENT_CONNECT_URL,
} from "../../../../configurations/agentConnect.conf";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";

export class UserAgentConnectService {
    private _client?: Client;

    get client() {
        return this._client;
    }

    async initClient() {
        const agentConnectIssuer = await Issuer.discover(AGENT_CONNECT_URL);
        this._client = new agentConnectIssuer.Client({
            client_id: AGENT_CONNECT_CLIENT_ID,
            client_secret: AGENT_CONNECT_CLIENT_SECRET,
            redirect_uris: [`${FRONT_OFFICE_URL}/auth/login`],
            response_types: ["code"],
            scope: "openid given_name family_name preferred_username birthdate email",
            id_token_signed_response_alg: "ES256",
            userinfo_signed_response_alg: "ES256",
        }); // => Client
    }

    async login(agentConnectUser: AgentConnectUser, tokenSet: TokenSet): Promise<UserWithJWTDto> {
        // TODO for more resilience try to get by agentConnectId first
        if (!agentConnectUser.email) throw new InternalServerError("email not contained in agent connect profile");
        const userWithSecrets: UserDbo | null = await userPort.getUserWithSecretsByEmail(agentConnectUser.email);
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

        user = (await Promise.all([userAuthService.updateJwt(user), this.saveTokenSet(user._id, tokenSet)]))[0];

        notifyService.notify(NotificationType.USER_LOGGED, { email: user.email, date: new Date() });
        if (!isNewUser) notifyService.notify(NotificationType.USER_UPDATED, removeSecrets(user));

        return user as UserWithJWTDto;
    }

    async getLogoutUrl(user: UserDto) {
        if (!this.client) throw new InternalServerError("AgentConnect client is not initialized");
        const tokenDbo = await agentConnectTokenPort.findLastActive(user._id);
        agentConnectTokenPort.deleteAllByUserId(user._id);
        if (!tokenDbo) return null;
        return this.client.endSessionUrl({
            id_token_hint: tokenDbo.token,
            state: generators.state(),
            post_logout_redirect_uri: `${FRONT_OFFICE_URL}/`,
        });
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
        await configurationsService.addEmailDomain(domain, false);

        const createdUser = (await userCrudService.createUser(userObject, true).catch(e => {
            if (e instanceof DuplicateIndexError) {
                notifyService.notify(NotificationType.USER_CONFLICT, userObject);
                throw new InternalServerError("An error has occurred");
            }
            throw e;
        })) as Omit<UserDbo, "hashPassword">;

        notifyService.notify(NotificationType.USER_CREATED, {
            email: userObject.email,
            firstname: userObject.firstName,
            lastname: userObject.lastName,
            url: null, // no activation link, agent connect users are automatically active
            active: true, // agent connect users automatically active
            signupAt: createdUser.signupAt,
            isAgentConnect: true,
        });

        return createdUser;
    }

    /**
     * users linked to agentConnect cannot change all properties of their profile
     * @param user initial user data
     * @param data new user data to save
     */
    agentConnectUpdateValidations(user: UserDto, data: Partial<UpdatableUser>): ValidationResult {
        if (!user.agentConnectId) return { valid: true };
        return applyValidations([
            {
                value: data.firstName,
                method: (value: string | undefined | null) => !value || value === user.firstName,
                error: new BadRequestError(
                    "Un utilisateur lié à AgentConnect ne peut pas changer de prénom sur l'application",
                ),
            },
            {
                value: data.lastName,
                method: (value: string | undefined | null) => !value || value === user.lastName,
                error: new BadRequestError(
                    "Un utilisateur lié à AgentConnect ne peut pas changer de nom de famille sur l'application",
                ),
            },
        ]);
    }

    private async saveTokenSet(userId: ObjectId, tokenSet: TokenSet) {
        if (!tokenSet.id_token) throw new InternalServerError("invalid tokenSet to save");
        return agentConnectTokenPort.upsert({
            userId,
            token: tokenSet.id_token,
            creationDate: new Date(),
        });
    }
}

const userAgentConnectService = new UserAgentConnectService();
export default userAgentConnectService;
