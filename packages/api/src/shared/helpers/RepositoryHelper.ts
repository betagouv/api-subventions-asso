import { WithId } from "mongodb";
import UserDbo from "../../modules/user/repositories/dbo/UserDbo";
import { WithStringId } from "../WithStringId";
import { DefaultObject } from "../../@types";

export const removeSecrets = <T extends UserDbo>(user: T) => {
    const { hashPassword: _hashPwd, jwt: _jwt, ...userWithoutSecret } = user;
    return userWithoutSecret;
};

export function uniformizeId<T>(document: WithId<T>): WithStringId<T> {
    const documentCopy = { ...document } as unknown as DefaultObject;
    documentCopy._id = document._id.toString();

    return documentCopy as unknown as WithStringId<T>;
}
