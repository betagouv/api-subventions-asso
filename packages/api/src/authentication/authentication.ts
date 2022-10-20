import { IVerifyOptions } from "passport-local";
import { LoginRequest } from "../@types";
import userService from "../modules/user/user.service";
import UserJWTError from "./errors/UserJWTError";

export function expressAuthentication(
    req: LoginRequest,
    securityName = "jwt",
    scopes: string[] = []
) {
    if (securityName !== "jwt") {
        console.warn(`${securityName} is not an valid securtiy please change by jwt`);
        return Promise.reject(new Error("Internal server error"));
    }

    return new Promise((resolve, reject) => {

        const user = req.user;

        if (!user) {
            let errorMessage = "User not logged"
            if (req.authInfo) errorMessage = (req.authInfo as IVerifyOptions).message;
            return reject(new UserJWTError(errorMessage));
        }

        // If user dont have a good role 
        if (!scopes.every(scope => user.roles.includes(scope))) {
            return reject(new UserJWTError("JWT does not contain required scope."));
        }

        resolve(userService.refrechExpirationToken(user));
    })
}