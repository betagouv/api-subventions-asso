import UserDbo from "../../modules/user/repositories/dbo/UserDbo";

export const removeSecrets = <T extends UserDbo>(user: T) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, jwt, ...userWithoutSecret } = user;
    return userWithoutSecret;
};
