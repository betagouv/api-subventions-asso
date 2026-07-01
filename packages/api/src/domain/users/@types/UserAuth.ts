import { JWT } from "./UserJwt";

export default interface UserAuth {
    hashPassword: string;
    jwt: JWT;
}
