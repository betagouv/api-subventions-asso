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

export async function createUser(email = USER_EMAIL) {
    await userService.createUser(email, [RoleEnum.user], DEFAULT_PASSWORD);
}

export async function createAdminUser() {
    await userService.createUser(ADMIN_EMAIL, [RoleEnum.user, RoleEnum.admin], DEFAULT_PASSWORD);
}
