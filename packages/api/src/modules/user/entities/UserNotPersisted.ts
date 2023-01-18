export default class UserNotPersisted {
    public email: string;
    public hashPassword: string;
    public roles: string[];
    public signupAt: Date;
    public jwt: { token: string; expirateDate: Date } | null;
    public active: boolean;
    public stats: {
        searchCount: number;
        lastSearchDate: Date | null;
    };

    constructor(params: {
        email: string;
        hashPassword: string;
        roles: string[];
        signupAt: Date;
        jwt: { token: string; expirateDate: Date } | null;
        active: boolean;
        stats: {
            searchCount: number;
            lastSearchDate: Date | null;
        };
    }) {
        this.email = params.email;
        this.hashPassword = params.hashPassword;
        this.roles = params.roles;
        this.signupAt = params.signupAt;
        this.jwt = params.jwt;
        this.active = params.active;
        this.stats = params.stats;
    }
}
