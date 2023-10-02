import { RoleEnum } from "../../src/@enums/Roles";
import userService from "../../src/modules/user/user.service";
import userAuthService from "../../src/modules/user/services/auth/user.auth.service";

const getToken = async (role = RoleEnum.user) => {
    const email = `${role}@beta.gouv.fr`;
    let user = await userService.findByEmail(email);
    if (!user) {
        if (role == RoleEnum.consumer) user = await userService.createConsumer({ email: email });
        else user = await userService.createUser({ email });
    }

    await userService.activeUser(user);
    if (role == RoleEnum.admin) await userService.addRolesToUser(user, [RoleEnum.admin]);

    const jwtData = await userAuthService.findJwtByEmail(user.email);

    return jwtData.jwt.token;
};

export const createAndGetUserToken = () => getToken();
export const createAndGetAdminToken = () => getToken(RoleEnum.admin);
export const createAndGetConsumerToken = () => getToken(RoleEnum.consumer);
