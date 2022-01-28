
export default class User {
    constructor(
        public email: string,
        public hashPassword: string,
        public roles: string[],
        public jwt: { token: string, expirateDate: Date },
        public active: boolean
    ){}
}

export type UserWithoutSecret = Omit<Omit<User, 'hashPassword'>, "jwt">;