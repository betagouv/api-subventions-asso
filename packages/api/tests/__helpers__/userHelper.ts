import { RoleEnum } from "../../src/@enums/Roles";
import userActivationService from "../../src/modules/user/services/activation/user.activation.service";
import userCrudService from "../../src/modules/user/services/crud/user.crud.service";
import userAuthService from "../../src/modules/user/services/auth/user.auth.service";

export const ADMIN_EMAIL = "admin@beta.gouv.fr";
export const USER_EMAIL = "user@beta.gouv.fr";
export const DEFAULT_PASSWORD = "TMP_PASSWOrd;12345678";

export async function createAndActiveUser(email = USER_EMAIL) {
    const user = await createUser(email);
    await userActivationService.activeUser(email);
    await userAuthService.updatePassword(user, DEFAULT_PASSWORD);
}

export async function createAndActiveAdminUser() {
    const user = await createAdminUser();
    await userActivationService.activeUser(ADMIN_EMAIL);
    await userAuthService.updatePassword(user, DEFAULT_PASSWORD);
}

export function createUser(email = USER_EMAIL) {
    return userCrudService.createUser({ email, roles: [RoleEnum.user] });
}

export function createAdminUser() {
    return userCrudService.createUser({ email: ADMIN_EMAIL, roles: [RoleEnum.user, RoleEnum.admin] });
}

export function createConsumerUser() {
    return userCrudService.createUser({ email: USER_EMAIL, roles: [RoleEnum.user, RoleEnum.consumer] });
}

export function getDefaultUser() {
    return userCrudService.findByEmail(USER_EMAIL);
}
