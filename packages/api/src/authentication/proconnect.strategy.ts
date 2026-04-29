import {
    buildAuthorizationUrl,
    authorizationCodeGrant,
    fetchUserInfo,
    randomState,
    randomNonce,
    type Configuration,
    TokenEndpointResponse,
    UserInfoResponse,
} from "openid-client";
import passport from "passport";
import { Request } from "express";
import { FRONT_OFFICE_URL } from "../configurations/front.conf";

export class AgentConnectStrategy extends passport.Strategy {
    name = "oidc";
    private _client: Configuration;
    private _verify: (
        req: Request,
        tokenSet: TokenEndpointResponse,
        userInfo: UserInfoResponse,
        done: (err: Error | null, user?: Express.User | false, info?: object) => void,
    ) => void;

    constructor(client: Configuration, verify) {
        super();
        this._client = client;
        this._verify = verify;
    }

    async authenticate(req: Request) {
        try {
            if (!req.query.code) {
                // Step 1 — generate state + nonce, store in session, redirect
                const state = randomState();
                const nonce = randomNonce();

                req.session["oidc:auth.agentconnect.gouv.fr"] = { state, nonce };

                // Force session save before redirect (your existing fix)
                await new Promise<void>((resolve, reject) => {
                    req.session.save(err => (err ? reject(err) : resolve()));
                });

                const redirectUrl = buildAuthorizationUrl(this._client, {
                    redirect_uri: `${FRONT_OFFICE_URL}/auth/login`,
                    scope: "openid uid given_name usual_name email siret",
                    acr_values: "eidas1",
                    response_type: "code",
                    state,
                    nonce,
                });

                return this.redirect(redirectUrl.href);
            }

            // Step 4 — exchange code for tokens
            const storedParams = req.session["oidc:auth.agentconnect.gouv.fr"];

            if (!storedParams) {
                return this.fail({ message: "Session OIDC params not found" });
            }

            const { state: storedState, nonce: storedNonce } = storedParams;

            // Clean up session immediately
            delete req.session["oidc:auth.agentconnect.gouv.fr"];

            // Build the full callback URL from the incoming request
            const callbackUrl = new URL(
                `${FRONT_OFFICE_URL}/auth/login?${new URLSearchParams(req.query as Record<string, string>).toString()}`,
            );

            // authorizationCodeGrant replaces client.callback()
            // It validates state, exchanges code, verifies id_token
            const tokenSet = await authorizationCodeGrant(this._client, callbackUrl, {
                pkceCodeVerifier: undefined, // no PKCE
                expectedState: storedState,
                expectedNonce: storedNonce,
                idTokenExpected: true,
            });

            // fetchUserInfo replaces client.userinfo()
            const userInfo = await fetchUserInfo(this._client, tokenSet.access_token!, tokenSet.claims()!.sub);

            this._verify(req, tokenSet, userInfo, (err: Error | null, user?: Express.User | false, info?: object) => {
                if (err) return this.error(err);
                if (!user) return this.fail(info);
                this.success(user, info);
            });
        } catch (err) {
            this.error(err as Error);
        }
    }
}
