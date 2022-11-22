import { RoleEnum } from "../../src/@enums/Roles";
import userService from "../../src/modules/user/user.service";

export default async function getAdminToken() {
    let user = await userService.findByEmail("admin@beta.gouv.fr");

    if (!user) {
        const result = await userService.createUser("admin@beta.gouv.fr");

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            throw new Error(result.message);
        }

        user = result.user
    }

    await userService.activeUser(user);
    await userService.addRolesToUser(user, [RoleEnum.admin]);
    const jwtData = await userService.findJwtByEmail(user.email);

    if (!jwtData.success) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        throw new Error(jwtData.message);
    }

    return jwtData.jwt.token
}