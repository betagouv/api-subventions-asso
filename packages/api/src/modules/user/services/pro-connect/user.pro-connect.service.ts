import { UpdatableUser, UserDto, UserWithJWTDto } from "dto";
import {
    discovery,
    ClientSecretPost,
    Configuration,
    TokenEndpointResponse,
    buildEndSessionUrl,
    randomState,
} from "openid-client";
import { ObjectId } from "mongodb";
import { BadRequestError, InternalServerError } from "core";
import { DuplicateIndexError } from "../../../../shared/errors/dbError/DuplicateIndexError";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import userAuthService from "../auth/user.auth.service";
import notifyService from "../../../notify/notify.service";
import UserDbo from "../../../../adapters/outputs/db/user/@types/UserDbo";
import { NotificationType } from "../../../notify/@types/NotificationType";
import { ProConnectUser } from "../../@types/ProConnectUser";
import userCrudService from "../crud/user.crud.service";
import { removeHashPassword, removeSecrets } from "../../../../shared/helpers/PortHelper";
import { applyValidations, ValidationResult } from "../../../../shared/helpers/validation.helper";
import proConnectTokenAdapter from "../../../../adapters/outputs/db/user/pro-connect.adapter";
import {
    PRO_CONNECT_CLIENT_ID,
    PRO_CONNECT_CLIENT_SECRET,
    PRO_CONNECT_URL,
} from "../../../../configurations/pro-connect.conf";
import { FRONT_OFFICE_URL } from "../../../../configurations/front.conf";

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

    async login(proConnectUser: ProConnectUser, tokenSet: TokenEndpointResponse): Promise<UserWithJWTDto> {
        // TODO for more resilience try to get by proConnectId first
        if (!proConnectUser.email) throw new InternalServerError("email not contained in pro connect profile");
        proConnectUser.email = proConnectUser.email.toLowerCase();
        const userWithSecrets: UserDbo | null = await userAdapter.getUserWithSecretsByEmail(proConnectUser.email);
        const isNewUser = !userWithSecrets;

        let user: Omit<UserDbo, "hashPassword"> = isNewUser
            ? await this.createUserFromProConnect(proConnectUser)
            : removeHashPassword(userWithSecrets);

        if (!isNewUser)
            user = {
                ...user,
                firstName: proConnectUser.given_name.split(" ")[0],
                lastName: proConnectUser.usual_name,
                proConnectId: proConnectUser.uid,
                active: true,
            };

        user = (await Promise.all([userAuthService.updateJwt(user), this.saveTokenSet(user._id, tokenSet)]))[0];

        notifyService.notify(NotificationType.USER_LOGGED, { email: user.email, date: new Date() });
        if (!isNewUser) notifyService.notify(NotificationType.USER_UPDATED, removeSecrets(user));

        return user as UserWithJWTDto;
    }

    async getLogoutUrl(user: UserDto) {
        if (!this.client) throw new InternalServerError("ProConnect client is not initialized");
        const tokenDbo = await proConnectTokenAdapter.findLastActive(user._id);
        proConnectTokenAdapter.deleteAllByUserId(user._id);
        if (!tokenDbo) return null;
        return buildEndSessionUrl(this._client as Configuration, {
            id_token_hint: tokenDbo.token,
            state: randomState(),
            post_logout_redirect_uri: `${FRONT_OFFICE_URL}/`,
        }).href;
    }

    async createUserFromProConnect(proConnectUser: ProConnectUser): Promise<Omit<UserDbo, "hashPassword">> {
        const userObject = {
            email: proConnectUser.email,
            firstName: proConnectUser.given_name.split(" ")[0],
            lastName: proConnectUser.usual_name,
            proConnectId: proConnectUser.uid,
            roles: ["user"],
        };

        const domain = userObject.email.match(/.*@(.*)/)?.[1];
        if (!domain) throw new InternalServerError("email from ProConnect invalid");

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
    proConnectUpdateValidations(user: UserDto, data: Partial<UpdatableUser>): ValidationResult {
        if (!user.proConnectId) return { valid: true };
        return applyValidations([
            {
                value: data.firstName,
                // @ts-expect-error: show since typescript update #3360
                method: (value: string | undefined | null) => !value || value === user.firstName,
                error: new BadRequestError(
                    "Un utilisateur lié à ProConnect ne peut pas changer de prénom sur l'application",
                ),
            },
            {
                value: data.lastName,
                // @ts-expect-error: show since typescript update #3360
                method: (value: string | undefined | null) => !value || value === user.lastName,
                error: new BadRequestError(
                    "Un utilisateur lié à ProConnect ne peut pas changer de nom de famille sur l'application",
                ),
            },
        ]);
    }

    private async saveTokenSet(userId: ObjectId, tokenSet: TokenEndpointResponse) {
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
