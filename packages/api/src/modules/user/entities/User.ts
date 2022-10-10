import { ObjectId, WithId } from "mongodb";

export default class User {
    public email: string;
    public hashPassword: string;
    public roles: string[];
    public signupAt: Date;
    public jwt: { token: string, expirateDate: Date };
    public active: boolean;
    public stats: {
        searchCount: number;
    }

    constructor(
        params: {
            email: string,
            hashPassword: string,
            roles: string[],
            signupAt: Date,
            jwt: { token: string, expirateDate: Date },
            active: boolean,
            stats: {
                searchCount: number,
                lastSearchDate: Date | null,
            },
        },
        public _id?: ObjectId
    ){
        this.email = params.email;
        this.hashPassword = params.hashPassword;
        this.roles = params.roles;
        this.signupAt = params.signupAt;
        this.jwt = params.jwt;
        this.active = params.active;
        this.stats = params.stats;
    }
}

export type UserWithoutSecret = Omit<Omit<WithId<User>, 'hashPassword'>, "jwt">;