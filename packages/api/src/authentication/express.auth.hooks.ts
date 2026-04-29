import passport from "passport";
import * as Sentry from "@sentry/node";
import { Client, Strategy as OpenIdClientStrategy } from "openid-client";
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

export async function registerAuthMiddlewares(app: Express) {
    // A passport middleware to handle User login
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

    // This verifies that the token sent by the user is valid
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
            new OpenIdClientStrategy(
                {
                    client: userAgentConnectService.client as Client,
                    params: {
                        acr_values: "eidas1",
                        scope: "openid uid given_name usual_name email siret",
                    },
                    usePKCE: false,
                    passReqToCallback: true,
                },
                // @ts-expect-error -- typing from module does not include express
                async (req: Request, tokenset, profile: AgentConnectUser, done) => {
                    try {
                        const user = await userAgentConnectService.login(profile, tokenset);
                        if (user) {
                            // TODO remove once we known more about ac data
                            Sentry.captureEvent({
                                level: "log",
                                extra: { acUser: profile },
                                message: "pro connect login",
                            } as Sentry.Event);
                            req.user = user;
                            req.authInfo = { message: "Logged in Successfully" };
                        }
                        return done(null, user);
                    } catch (e) {
                        return done(e as Error);
                    }
                },
            ),
        );
    }

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
            console.log("=== LOGIN SESSION DEBUG ===");
            console.log("Session ID:", req?.sessionID);
            console.log("Session data:", JSON.stringify(req?.session, null, 2));
            console.log("Cookie header received:", req.headers.cookie);
            console.log("Has code param:", !!req.query.code);
            next();
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

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: UserDto, done) => {
        done(null, user);
    });

    app.use((req, res, next) => {
        if (req.authInfo) return next(); // if authInfo is not empty then the authentication is already check
        passport.authenticate("jwt", (error, user: UserDto, info: IVerifyOptions) => {
            if (user && !error) {
                req.user = user;
            }
            req.authInfo = info;

            next();
        })(req, res, next);
    });
}
