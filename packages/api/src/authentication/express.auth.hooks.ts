import passport from "passport";
import { Configuration, TokenEndpointResponse } from "openid-client";
import { Express, Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";
import { UserDto } from "dto";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { JWT_SECRET } from "../configurations/jwt.conf";
import { getJtwTokenFromRequest } from "../shared/helpers/HttpHelper";
import userAuthService from "../modules/user/services/auth/user.auth.service";
import { PRO_CONNECT_ENABLED } from "../configurations/pro-connect.conf";
import userProConnectService from "../modules/user/services/pro-connect/user.pro-connect.service";
import { ProConnectUser } from "../modules/user/@types/ProConnectUser";
import { ProConnectStrategy } from "./proconnect.strategy";
import userCrudService from "../modules/user/services/crud/user.crud.service";

export async function registerAuthMiddlewares(app: Express) {
    // @ts-expect-error: fix this later
    passport.serializeUser((user: UserDto, done) => {
        done(null, user.email);
    });

    passport.deserializeUser(async (email: string, done) => {
        try {
            const user = await userCrudService.findByEmail(email);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // only use for API usage (consumer) -> retrieve consumer token
    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    const user = await userAuthService.login(email.toLocaleLowerCase(), password);
                    return done(null, user, { message: "Logged in Successfully" });
                } catch (e) {
                    done(e);
                }
            },
        ),
    );

    // only used for consumers (through consumer JWT token)
    passport.use(
        new JwtStrategy(
            {
                secretOrKey: JWT_SECRET,
                jwtFromRequest: getJtwTokenFromRequest,
                passReqToCallback: true,
            },
            async (req: Request, tokenPayload, done) => {
                try {
                    const user = await userAuthService.authenticate(tokenPayload, getJtwTokenFromRequest(req));
                    if (user) return done(null, user, { message: "Logged in Successfully" });
                    return done();
                } catch (e) {
                    done(e);
                }
            },
        ),
    );

    if (PRO_CONNECT_ENABLED) {
        await userProConnectService.initClient();

        passport.use(
            "oidc",
            new ProConnectStrategy(
                userProConnectService.client as Configuration, // the Configuration object from discovery()
                async (req: Request, tokenSet: TokenEndpointResponse, profile: ProConnectUser, done) => {
                    try {
                        const user = await userProConnectService.login(profile, tokenSet);
                        return done(null, user, { idToken: tokenSet.id_token });
                    } catch (e) {
                        return done(e as Error);
                    }
                },
            ),
        );
    }

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

    app.get("/auth/logout", (req, res, next) => {
        req.logout(err => {
            if (err) return next(err);
            req.session.destroy(err => {
                if (err) return next(err);
                // clear OIDC token
                res.clearCookie("connect.sid");
                // pass to TSOA route
                next();
            });
        });
    });

    app.get("/auth/ac/login", (req, res, next) => {
        if (!req.query.code) {
            return passport.authenticate("oidc")(req, res, next);
        }
        passport.authenticate("oidc", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info?.message ?? "Authentication failed" });
            req.login(user, loginErr => {
                if (loginErr) return next(loginErr);
                return res.json({ user });
            });
        })(req, res, next);
    });

    // only used to allow jwt connection for consumer or classic login/pwd strategy
    app.use((req, res, next) => {
        // authInfo bypass this middleware if we just logged in (classic login or oidc)
        // req.user bypass JWT auth verification when using OIDC (ProConnect)
        if (req.authInfo || req.user) return next(); // if authInfo is not empty then the authentication is already check
        passport.authenticate("jwt", (error, user: UserDto, info: IVerifyOptions) => {
            if (user && !error) {
                req.user = user;
            }
            req.authInfo = info;

            next();
        })(req, res, next);
    });
}
