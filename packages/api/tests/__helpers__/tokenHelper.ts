import { RoleEnum } from "../../src/@enums/Roles";
import userAuthService from "../../src/modules/user/services/auth/user.auth.service";
import userRolesService from "../../src/modules/user/services/roles/user.roles.service";
import userActivationService from "../../src/modules/user/services/activation/user.activation.service";
import userCrudService from "../../src/modules/user/services/crud/user.crud.service";
import userConsumerService from "../../src/modules/user/services/consumer/user.consumer.service";

export const getTokenByUser = async user => {
    await userActivationService.activeUser(user);

    const jwtData = await userAuthService.findJwtByEmail(user.email);

    return jwtData.jwt.token;
};

const getToken = async (role = RoleEnum.user) => {
    const email = `${role}@beta.gouv.fr`;
    let user = await userCrudService.findByEmail(email);
    if (!user) {
        if (role == RoleEnum.consumer) user = await userConsumerService.createConsumer({ email: email });
        else user = await userCrudService.createUser({ email });
    }

    if (role == RoleEnum.admin) await userRolesService.addRolesToUser(user, [RoleEnum.admin]);
    return getTokenByUser(user);
};

export const createAndGetUserToken = () => getToken();
export const createAndGetAdminToken = () => getToken(RoleEnum.admin);
export const createAndGetConsumerToken = () => getToken(RoleEnum.consumer);
