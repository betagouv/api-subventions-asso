import { WithId } from "mongodb";
import UserDbo from "../../dataProviders/db/user/UserDbo";
import { WithStringId } from "../WithStringId";
import { DefaultObject } from "../../@types";

export const removeSecrets = <T extends Partial<UserDbo>>(user: T) => {
    if (!user) return user;

    const { hashPassword: _hashPwd, jwt: _jwt, ...userWithoutSecret } = user;
    return userWithoutSecret;
};

export const removeHashPassword = <T extends Partial<UserDbo>>(user: T) => {
    if (!user) return user;

    const { hashPassword: _hashPwd, ...userWithoutPwd } = user;
    return userWithoutPwd;
};

export function uniformizeId<T>(document: WithId<T>): WithStringId<T> {
    const documentCopy = { ...document } as unknown as DefaultObject;
    documentCopy._id = document._id.toString();

    return documentCopy as unknown as WithStringId<T>;
}
