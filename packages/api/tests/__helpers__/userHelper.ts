import { RoleEnum } from "../../src/@enums/Roles";
import userActivationService from "../../src/modules/user/services/activation/user.activation.service";
import userCrudService from "../../src/modules/user/services/crud/user.crud.service";

export const ADMIN_EMAIL = "admin@beta.gouv.fr";
export const USER_EMAIL = "user@beta.gouv.fr";
export const DEFAULT_PASSWORD = "TMP_PASSWOrd;12345678";

export async function createAndActiveUser(email = USER_EMAIL) {
    await createUser(email);
    await userActivationService.activeUser(email);
}

export async function createAndActiveAdminUser() {
    await createAdminUser();
    await userActivationService.activeUser(ADMIN_EMAIL);
}

export function createUser(email = USER_EMAIL) {
    return userCrudService.createUser({ email, roles: [RoleEnum.user] });
}

export function createAdminUser() {
    return userCrudService.createUser({ email: ADMIN_EMAIL, roles: [RoleEnum.user, RoleEnum.admin] });
}

export function getDefaultUser() {
    return userCrudService.findByEmail(USER_EMAIL);
}
