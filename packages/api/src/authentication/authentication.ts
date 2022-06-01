import * as express from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configurations/jwt.conf";
import userService from "../modules/user/user.service";
import UserJWTError from "./errors/UserJWTError";

export function expressAuthentication(
    request: express.Request,
    securityName = "jwt",
    scopes: string[] = []
) {
    if (securityName !== "jwt") {
        console.warn(`${securityName} is not an valid securtiy please change by jwt`);
        return Promise.reject(new Error("Internal server error"));
    }

    const token =
        request.body.token ||
        request.query.token ||
        request.headers["x-access-token"];

    if (!token) return Promise.reject(new UserJWTError("No token provided"))

    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, async (err: unknown, decoded: unknown) => {
            if (err) {
                console.warn(err);
                reject(new UserJWTError("JWT parse error"));
            } else {
                const email = (decoded as { [key: string]: string })["email"];
                const user = await userService.findByEmail(email);

                if (!user) {
                    return reject(new UserJWTError("User not found"));
                }

                if (!user.active) {
                    return reject(new UserJWTError("User is not active"));
                }

                const result = await userService.findJwtByEmail(email)

                if (!result.success || result.jwt.token !== token) {
                    return reject(new UserJWTError("JWT is not valid anymore"));
                }

                // If JWT is expired
                if (result.jwt.expirateDate.getTime() < Date.now()) {
                    return reject(new UserJWTError("JWT has expired, please login try again"));
                }

                // If user dont have a good role 
                if (!scopes.every(scope => user.roles.includes(scope))) {
                    return reject(new UserJWTError("JWT does not contain required scope."));
                }

                resolve(await userService.refrechExpirationToken(user));
            }
        });
    });
}