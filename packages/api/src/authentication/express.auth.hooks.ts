import passport from "passport";
import { Express, Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";
import OpenIDConnectStrategy = require("passport-openidconnect");
import { UserDto } from "dto";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { JWT_SECRET } from "../configurations/jwt.conf";
import { getJtwTokenFromRequest } from "../shared/helpers/HttpHelper";
import userAuthService from "../modules/user/services/auth/user.auth.service";
import {
    AGENT_CONNECT_CLIENT_ID,
    AGENT_CONNECT_CLIENT_SECRET,
    AGENT_CONNECT_ENABLED,
    AGENT_CONNECT_URL,
} from "../configurations/agentConnect.conf";
import { FRONT_OFFICE_URL } from "../configurations/front.conf";
import userAgentConnectService from "../modules/user/services/agentConnect/user.agentConnect.service";

export function authMocks(app: Express) {
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

    if (AGENT_CONNECT_ENABLED) {
        passport.use(
            new OpenIDConnectStrategy(
                {
                    issuer: AGENT_CONNECT_URL,
                    authorizationURL: `${AGENT_CONNECT_URL}/authorize`,
                    tokenURL: `${AGENT_CONNECT_URL}/token`,
                    userInfoURL: `${AGENT_CONNECT_URL}/userinfo`,
                    clientID: AGENT_CONNECT_CLIENT_ID,
                    clientSecret: AGENT_CONNECT_CLIENT_SECRET,
                    callbackURL: `${FRONT_OFFICE_URL}/auth/login?sucess=true`,
                    passReqToCallback: true, // TODO check behaviour in this context
                    // TODO claims:
                },
                async function verify(_issuer, profile, done) {
                    try {
                        const user = await userAgentConnectService.login(profile);
                        done(null, user, { message: "Logged in Successfully" });
                    } catch (e) {
                        done(e);
                    }
                },
            ),
        );
    }

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

    app.get("/auth/ac/login", passport.authenticate("openidconnect"));

    app.get(
        "/auth/ac/redirect",
        passport.authenticate("openidconnect", {
            successReturnToOrRedirect: "/",
            failureRedirect: "/login",
        }),
    );

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
