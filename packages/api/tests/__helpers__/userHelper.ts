import { RoleEnum } from "../../src/@enums/Roles";
import userService from "../../src/modules/user/user.service";

export const ADMIN_EMAIL = "admin@beta.gouv.fr";
export const USER_EMAIL = "user@beta.gouv.fr";
export const DEFAULT_PASSWORD = "TMP_PASSWOrd;12345678";

export async function createAndActiveUser(email = USER_EMAIL) {
    await createUser(email);
    await userService.activeUser(email);
}

export async function createAndActiveAdminUser() {
    await createAdminUser();
    await userService.activeUser(ADMIN_EMAIL);
}

export function createUser(email = USER_EMAIL) {
    return userService.createUser(email, [RoleEnum.user]);
}

export function createAdminUser() {
    return userService.createUser(ADMIN_EMAIL, [RoleEnum.user, RoleEnum.admin]);
}

export function getDefaultUser() {
    return userService.findByEmail(USER_EMAIL);
}
