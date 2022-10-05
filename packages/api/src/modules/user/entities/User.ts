import { ObjectId, WithId } from "mongodb";

export default class User {
    constructor(
        public email: string,
        public hashPassword: string,
        public roles: string[],
        public jwt: { token: string, expirateDate: Date },
        public active: boolean,
        public stats: {
            searchCount: number
        },
        public _id?: ObjectId
    ){}
}

export type UserWithoutSecret = Omit<Omit<WithId<User>, 'hashPassword'>, "jwt">;