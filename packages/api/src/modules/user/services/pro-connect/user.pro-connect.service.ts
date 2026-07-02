import {
    discovery,
    ClientSecretPost,
    Configuration,
    TokenEndpointResponse,
    buildEndSessionUrl,
    randomState,
} from "openid-client";
import { BadRequestError, InternalServerError } from "core";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import userAuthService from "../auth/user.auth.service";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { ProConnectUser } from "../../@types/ProConnectUser";
import userCrudService from "../crud/user.crud.service";
import { applyValidations, ValidationResult } from "../../../../shared/helpers/validation.helper";
import proConnectTokenAdapter from "../../../../adapters/outputs/db/user/pro-connect.adapter";
import {
    PRO_CONNECT_CLIENT_ID,
    PRO_CONNECT_CLIENT_SECRET,
    PRO_CONNECT_URL,
} from "../../../../configurations/pro-connect.conf";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";
import UserEntity from "../../../../domain/users/UserEntity";
import { UserRoles } from "../../../../domain/users/@types/UserRoles";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
import UpdatableUserFields from "../../../../domain/users/@types/UpdatableUserFields";

export class UserProConnectService {
    private _client?: Configuration;

    get client() {
        return this._client;
    }

    async initClient() {
        // discovery() replaces Issuer.discover() + new Client()
        // ClientSecretPost is the auth method — matches your client_secret_post setup
        this._client = await discovery(
            new URL(PRO_CONNECT_URL),
            PRO_CONNECT_CLIENT_ID,
            {
                // 3rd param — client metadata
                client_secret: PRO_CONNECT_CLIENT_SECRET,
                redirect_uris: [`${FRONT_OFFICE_URL}/auth/login`],
                response_types: ["code"],
                id_token_signed_response_alg: "ES256",
                userinfo_signed_response_alg: "ES256",
            },
            ClientSecretPost(PRO_CONNECT_CLIENT_SECRET),
        );
    }

    async login(proConnectUser: ProConnectUser, tokenSet: TokenEndpointResponse) {
        // TODO for more resilience try to get by proConnectId first
        if (!proConnectUser.email) throw new InternalServerError("email not contained in pro connect profile");
        proConnectUser.email = proConnectUser.email.toLowerCase();
        let user: UserEntity | null;

        user = await userAdapter.getUserWithSecretsByEmail(proConnectUser.email);
        if (!user) return this.createUserFromProConnect(proConnectUser);
        else {
            user = new UserEntity({
                ...user,
                firstName: proConnectUser.given_name.split(" ")[0],
                lastName: proConnectUser.usual_name,
                proConnectId: proConnectUser.uid,
                active: true,
            });
            await Promise.all([userAuthService.updateJwt(user), this.saveTokenSet(user.id, tokenSet)])[0];
            notifyService.notify(NotificationType.USER_LOGGED, { email: user.email, date: new Date() });
            notifyService.notify(NotificationType.USER_UPDATED, user);
        }

        return user;
    }

    async getLogoutUrl(user: UserEntity) {
        if (!this.client) throw new InternalServerError("ProConnect client is not initialized");
        const tokenDbo = await proConnectTokenAdapter.findLastActive(user.id);
        proConnectTokenAdapter.deleteAllByUserId(user.id);
        if (!tokenDbo) return null;
        return buildEndSessionUrl(this._client as Configuration, {
            id_token_hint: tokenDbo.token,
            state: randomState(),
            post_logout_redirect_uri: `${FRONT_OFFICE_URL}/`,
        }).href;
    }

    async createUserFromProConnect(proConnectUser: ProConnectUser) {
        const userObject = new NewUserEntity({
            email: proConnectUser.email,
            firstName: proConnectUser.given_name.split(" ")[0],
            lastName: proConnectUser.usual_name,
            proConnectId: proConnectUser.uid,
            roles: [UserRoles.USER],
        });

        const domain = userObject.email.match(/.*@(.*)/)?.[1];
        if (!domain) throw new InternalServerError("email from ProConnect invalid");

        const createdUser = await userCrudService.createUser(userObject).catch(e => {
            if (e instanceof DuplicateIndexError) {
                notifyService.notify(NotificationType.USER_CONFLICT, userObject);
                throw new InternalServerError("An error has occurred");
            }
            throw e;
        });

        notifyService.notify(NotificationType.USER_CREATED, {
            email: userObject.email,
            firstname: userObject.firstName,
            lastname: userObject.lastName,
            url: null, // no activation link, pro connect users are automatically active
            active: true, // pro connect users automatically active
            signupAt: createdUser.signupAt,
            isProConnect: true,
        });

        return createdUser;
    }

    /**
     * users linked to proConnect cannot change all properties of their profile
     * @param user initial user data
     * @param data new user data to save
     */
    proConnectUpdateValidations(originalUser: UserEntity, updatedUser: Partial<UpdatableUserFields>): ValidationResult {
        if (!originalUser.proConnectId) return { valid: true };
        return applyValidations([
            {
                value: updatedUser.firstName,
                // @ts-expect-error: show since typescript update #3360
                method: (value: string | undefined | null) => !value || value === originalUser.firstName,
                error: new BadRequestError(
                    "Un utilisateur lié à ProConnect ne peut pas changer de prénom sur l'application",
                ),
            },
            {
                value: updatedUser.lastName,
                // @ts-expect-error: show since typescript update #3360
                method: (value: string | undefined | null) => !value || value === originalUser.lastName,
                error: new BadRequestError(
                    "Un utilisateur lié à ProConnect ne peut pas changer de nom de famille sur l'application",
                ),
            },
        ]);
    }

    private async saveTokenSet(userId: string, tokenSet: TokenEndpointResponse) {
        if (!tokenSet.id_token) throw new InternalServerError("invalid tokenSet to save");
        return proConnectTokenAdapter.upsert({
            userId,
            token: tokenSet.id_token,
            creationDate: new Date(),
        });
    }
}

const userProConnectService = new UserProConnectService();
export default userProConnectService;
