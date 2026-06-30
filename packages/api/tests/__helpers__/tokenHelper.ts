import { RoleEnum, UserRoles } from "../../src/domain/users/@types/UserRoles";
import userAuthService from "../../src/modules/user/services/auth/user.auth.service";
import userCrudService from "../../src/modules/user/services/crud/user.crud.service";
import userConsumerService from "../../src/modules/user/services/consumer/user.consumer.service";
import userAdapter from "../../src/adapters/outputs/db/user/user.adapter";
import NewUserEntity from "../../src/domain/users/NewUserEntity";

export const getTokenByUser = async user => {
    delete user.roles;
    await userAdapter.update({ ...user, active: true });

    const jwtData = await userAuthService.findJwtByEmail(user.email);

    return jwtData.jwt.token;
};

const getToken = async (role: UserRoles = UserRoles.USER) => {
    const email = `${role}@beta.gouv.fr`;
    let user;

    if (role == RoleEnum.consumer) {
        user = await userConsumerService.createConsumer(
            new NewUserEntity({ email: email, roles: [UserRoles.USER, UserRoles.CONSUMER] }),
        );
    } else if (role == UserRoles.ADMIN) {
        user = await userCrudService.createUser(new NewUserEntity({ email, roles: [UserRoles.ADMIN, UserRoles.USER] }));
    } else user = await userCrudService.createUser(new NewUserEntity({ email }));

    return getTokenByUser(user);
};

export const createAndGetUserToken = () => getToken();
export const createAndGetAdminToken = () => getToken(RoleEnum.admin);
export const createAndGetConsumerToken = () => getToken(RoleEnum.consumer);
