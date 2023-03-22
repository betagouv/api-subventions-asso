import userService from "../../src/modules/user/user.service";

export default async function createAndGetUserToken() {
    let user = await userService.findByEmail("user@beta.gouv.fr");

    if (!user) user = await userService.createUser("user@beta.gouv.fr");

    await userService.activeUser(user);
    const jwtData = await userService.findJwtByEmail(user.email);

    return jwtData.jwt.token;
}
