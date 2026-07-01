import { RoleEnum } from "../../src/domain/users/@types/UserRoles";
import userCrudService from "../../src/modules/user/services/crud/user.crud.service";
import userAuthService from "../../src/modules/user/services/auth/user.auth.service";
import UserEntity from "../../src/domain/users/UserEntity";
import NewUserEntity from "../../src/domain/users/NewUserEntity";

export const ADMIN_EMAIL = "admin@beta.gouv.fr";
export const USER_EMAIL = "user@beta.gouv.fr";
export const DEFAULT_PASSWORD = "TMP_PASSWOrd;12345678";

export async function createAndActiveUser(email = USER_EMAIL) {
    const user = await createUser(email);
    await userCrudService.update(new UserEntity({ ...user, active: true }));
    await userAuthService.updatePassword(user, DEFAULT_PASSWORD);
}

export async function createAndActiveAdminUser() {
    const user = await createAdminUser();
    await userCrudService.update(new UserEntity({ ...user, active: true }));
    await userAuthService.updatePassword(user, DEFAULT_PASSWORD);
}

export function createUser(email = USER_EMAIL) {
    return userCrudService.createUser(new NewUserEntity({ email, roles: [RoleEnum.user] }));
}

export function createAdminUser() {
    return userCrudService.createUser(
        new NewUserEntity({ email: ADMIN_EMAIL, roles: [RoleEnum.user, RoleEnum.admin] }),
    );
}

export function createConsumerUser() {
    return userCrudService.createUser(
        new NewUserEntity({ email: USER_EMAIL, roles: [RoleEnum.user, RoleEnum.consumer] }),
    );
}

export function getDefaultUser() {
    return userCrudService.findByEmail(USER_EMAIL);
}
