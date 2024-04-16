import passport from "passport";
import { generators, Issuer, Strategy as OpenIdClientStrategy } from "openid-client";
import { Express, Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";
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
import { AgentConnectUser } from "../modules/user/@types/AgentConnectUser";
import nonce = generators.nonce;

export async function authMocks(app: Express) {
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
        const agentConnectIssuer = await Issuer.discover(AGENT_CONNECT_URL);
        console.log("Discovered issuer %s %O", agentConnectIssuer.issuer, agentConnectIssuer.metadata);

        const client = new agentConnectIssuer.Client({
            client_id: AGENT_CONNECT_CLIENT_ID,
            client_secret: AGENT_CONNECT_CLIENT_SECRET,
            redirect_uris: [`${FRONT_OFFICE_URL}/auth/login`], // TODO contact them to add "?sucess=true",
            response_types: ["code"],
            scope: "openid given_name family_name preferred_username birthdate email",
            id_token_signed_response_alg: "ES256",
            userinfo_signed_response_alg: "ES256",
            // token_endpoint_auth_method (default "client_secret_basic")
        }); // => Client
        passport.use(
            "oidc",
            new OpenIdClientStrategy(
                {
                    client,
                    params: {
                        acr_values: "eidas1",
                        scope: "openid uid given_name email phone organizational_unit siret usual_name belonging_population",
                    },
                    usePKCE: false,
                    passReqToCallback: true,
                },
                // @ts-expect-error -- typing from module does not include express
                async (req: Request, _tokenset, profile: AgentConnectUser, done) => {
                    try {
                        const user = await userAgentConnectService.login(profile);
                        if (user) {
                            req.user = user;
                            req.authInfo = { message: "Logged in Successfully" };
                        }
                        done(null, user);
                    } catch (e) {
                        done(e as Error);
                    }
                },
            ),
        );
    }

    // @ts-expect-error -- typing
    app.get("/auth/ac/login", passport.authenticate("oidc", { nonce: nonce() }));

    app.get("/auth/ac/redirect", passport.authenticate("oidc"));

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
