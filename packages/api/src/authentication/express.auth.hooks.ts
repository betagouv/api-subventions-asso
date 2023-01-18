import passport from "passport";
import { Express, Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";
import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";

import { JWT_SECRET } from "../configurations/jwt.conf";
import { getJtwTokenFromRequest } from "../shared/helpers/HttpHelper";
import userService, { UserServiceError } from "../modules/user/user.service";

export function authMocks(app: Express) {
    // A passport middleware to handle User login
    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            async (email, password, done) => {
                const result = await userService.login(email, password);
                if (result.success) return done(null, result.user, { message: "Logged in Successfully" });

                return done(null, false, { message: result.code.toString() }); // It's hack because message accept just string
            }
        )
    );

    // This verifies that the token sent by the user is valid
    passport.use(
        new JwtStrategy(
            {
                secretOrKey: JWT_SECRET,
                jwtFromRequest: getJtwTokenFromRequest,
                passReqToCallback: true
            },
            async (req: Request, tokenPayload, done) => {
                const result = await userService.authenticate(tokenPayload, getJtwTokenFromRequest(req));
                if (result.success && result.user)
                    return done(null, result.user, { message: "Logged in Successfully" });
                else return done(null, false, { message: (result as UserServiceError).message });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: UserDto, done) => {
        done(null, user);
    });

    app.post("/auth/login", (req, res, next) => {
        passport.authenticate("login", (error, user, info: IVerifyOptions) => {
            if (error) return next(error);
            if (user) {
                req.user = user;
            }
            req.authInfo = info;

            next();
        })(req, res, next);
    });

    app.use((req, res, next) => {
        if (req.authInfo) return next(); // if authInfo is not empty then the auhtentication is already check
        passport.authenticate("jwt", (error, user: UserDto, info: IVerifyOptions) => {
            if (error) return next(error);
            if (user) {
                req.user = user;
            }
            req.authInfo = info;

            next();
        })(req, res, next);
    });
}
