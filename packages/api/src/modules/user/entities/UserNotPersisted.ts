import UserDbo from "../repositories/dbo/UserDbo";

export default class UserNotPersisted implements Omit<UserDbo, "_id"> {
    public email: string;
    public hashPassword: string;
    public roles: string[];
    public signupAt: Date;
    public jwt: { token: string; expirateDate: Date } | null;
    public active: boolean;

    constructor(params: Omit<UserDbo, "_id">) {
        this.email = params.email;
        this.hashPassword = params.hashPassword;
        this.roles = params.roles;
        this.signupAt = params.signupAt;
        this.jwt = params.jwt;
        this.active = params.active;
    }
}
