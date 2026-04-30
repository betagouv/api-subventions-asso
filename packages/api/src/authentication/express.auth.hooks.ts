import passport from "passport";
import { Configuration, TokenEndpointResponse } from "openid-client";
import { Express, Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";
import { UserDto } from "dto";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { JWT_SECRET } from "../configurations/jwt.conf";
import { getJtwTokenFromRequest } from "../shared/helpers/HttpHelper";
import userAuthService from "../modules/user/services/auth/user.auth.service";
import { AGENT_CONNECT_ENABLED } from "../configurations/pro-connect.conf";
import userAgentConnectService from "../modules/user/services/agentConnect/user.agentConnect.service";
import { AgentConnectUser } from "../modules/user/@types/AgentConnectUser";
import { AgentConnectStrategy } from "./proconnect.strategy";
import userCrudService from "../modules/user/services/crud/user.crud.service";

export async function registerAuthMiddlewares(app: Express) {
    // define passport login strategy
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

    // define passport jwt strategy
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

    if (AGENT_CONNECT_ENABLED) {
        await userAgentConnectService.initClient();

        passport.use(
            "oidc",
            new AgentConnectStrategy(
                userAgentConnectService.client as Configuration, // the Configuration object from discovery()
                async (req: Request, tokenSet: TokenEndpointResponse, profile: AgentConnectUser, done) => {
                    try {
                        const user = await userAgentConnectService.login(profile, tokenSet);
                        return done(null, user);
                    } catch (e) {
                        return done(e as Error);
                    }
                },
            ),
        );
    }

    // @ts-expect-error: fix this later
    passport.serializeUser((user: UserDto, done) => {
        done(null, user.email);
    });

    passport.deserializeUser(async (email: string, done) => {
        try {
            const user = await userCrudService.findByEmail(email);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
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

    app.get(
        "/auth/ac/login",
        (req, res, next) => {
            if (req.query.code) return next(); // Step 4, skip

            // Force session creation BEFORE passport redirects
            // This ensures Set-Cookie is included in the redirect response
            // @ts-expect-error: force session creation with random field
            req.session.initiated = true;
            req.session.save(err => {
                if (err) return next(err);
                next();
            });
        },
        (req, res, next) => {
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
        },
    );

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
