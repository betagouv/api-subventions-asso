import { RoleEnum } from "../../src/@enums/Roles";
import userService from "../../src/modules/user/user.service";

export default async function createAndGetAdminToken() {
    let user = await userService.findByEmail("admin@beta.gouv.fr");

    if (!user) user = await userService.createUser("admin@beta.gouv.fr");

    await userService.activeUser(user);
    await userService.addRolesToUser(user, [RoleEnum.admin]);
    const jwtData = await userService.findJwtByEmail(user.email);

    return jwtData.jwt.token;
}
