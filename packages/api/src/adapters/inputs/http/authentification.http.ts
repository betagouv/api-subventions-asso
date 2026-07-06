import type { CookieOptions, Request as ExpressRequest } from "express";
import type {
    ResetPasswordDtoResponse,
    TokenValidationDtoResponse,
    ActivateDtoResponse,
    LoginDtoResponse,
    ActivateUserBody,
    UserDto,
} from "dto";
import {
    AdminTerritorialLevel,
    AgentJobTypeEnum,
    AgentTypeEnum,
    RegistrationSrcTypeEnum,
    TerritorialScopeEnum,
    TokenValidationType,
} from "dto"; // used as enum value so it cannot be imported using `import type`
import type { IdentifiedRequest, LoginRequest } from "../../../@types";

import { DEV } from "../../../configurations/env.conf";
import { DOMAIN } from "../../../configurations/domain.conf";
import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security, Example } from "tsoa";
import { BadRequestError, InternalServerError } from "core";
import userAuthService from "../../../modules/user/services/auth/user.auth.service";
import userProfileService from "../../../modules/user/services/profile/user.profile.service";
import userActivationService from "../../../modules/user/services/activation/user.activation.service";
import userProConnectService from "../../../modules/user/services/pro-connect/user.pro-connect.service";
import { USER_DTO_DEFAULT, USER_DTO_LOGGED, USER_DTO_SIGNIN } from "./examples/Users";
import UserEntity from "../../../domain/users/UserEntity";

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationHttp extends Controller {
    private getCookieOption(): CookieOptions {
        const cookieOption: CookieOptions = {
            secure: true,
            sameSite: "strict",
            domain: DOMAIN,
            httpOnly: true,
        };

        if (DEV) {
            cookieOption.domain = undefined;
            cookieOption.secure = false;
            cookieOption.sameSite = "lax";
        }

        return cookieOption;
    }

    private setCookie(req: ExpressRequest, user) {
        req.res?.cookie("token", user.jwt.token, {
            ...this.getCookieOption(),
            expires: user.jwt.expirateDate,
        });
    }

    /**
     * @summary Envoie un e-mail de réinitialisation de mot de passe
     */
    @Example<{ success: boolean }>({ success: true })
    @Post("/forget-password")
    public async forgetPassword(@Body() body: { email: string }): Promise<{ success: boolean }> {
        await userActivationService.forgetPassword(body.email.toLocaleLowerCase());
        return { success: true };
    }

    /**
     * @summary Réinitialise le mot de passe via un token de réinitialisation
     */
    @Example<ResetPasswordDtoResponse>({
        user: USER_DTO_DEFAULT,
    })
    @Post("/reset-password")
    public async resetPassword(
        @Body() body: { password: string; token: string },
        @Request() req,
    ): Promise<ResetPasswordDtoResponse> {
        try {
            const user = (await userActivationService.resetPassword(body.password, body.token)) as UserDto;
            this.setCookie(req, user);
            return { user };
        } catch (e) {
            console.log("ici", e);
            throw e;
        }
    }

    private _login(req) {
        if (req.user) {
            this.setCookie(req, req.user);
            return { user: req.user };
        }

        throw new InternalServerError();
    }

    /**
     * @summary Authentification par e-mail et mot de passe
     */
    @Example<LoginDtoResponse>({
        user: USER_DTO_LOGGED,
    })
    @Post("/login")
    @SuccessResponse("200", "Login successfully")
    public login(
        @Body() _body: { email: string; password: string }, // For docs and validation
        @Request() req: LoginRequest,
    ): LoginDtoResponse {
        // If you change the route please change in express.auth.hooks.ts
        return this._login(req);
    }

    /**
     * @summary Authentification via ProConnect (ex ProConnect)
     */
    @Example<LoginDtoResponse>({
        user: USER_DTO_LOGGED,
    })
    @Get("/ac/login")
    @SuccessResponse("200", "Login successfully")
    public proConnectLogin(@Request() req: Request): LoginDtoResponse {
        // If you change the route please change in express.auth.hooks.ts
        return this._login(req);
    }

    /**
     * @summary Active un compte utilisateur via un token d'activation
     */
    @Example<ActivateDtoResponse>({
        user: USER_DTO_SIGNIN,
    })
    @Example<ActivateUserBody>({
        token: "string",
        data: {
            password: "string",
            agentType: AgentTypeEnum.CENTRAL_ADMIN,
            jobType: [AgentJobTypeEnum.ADMINISTRATOR, AgentJobTypeEnum.CONTROLLER],
            service: "service",
            phoneNumber: "0601020304",
            structure: "structure",
            region: "Île de France",
            decentralizedLevel: AdminTerritorialLevel.REGIONAL,
            decentralizedTerritory: "string",
            territorialScope: TerritorialScopeEnum.REGIONAL,
            registrationSrc: [RegistrationSrcTypeEnum.COLLEAGUES_HIERARCHY],
            registrationSrcEmail: "john.doe@gouv.fr",
            registrationSrcDetails: "string",
        },
    })
    @Post("/activate")
    @SuccessResponse("200")
    public async activate(@Body() body: ActivateUserBody, @Request() req): Promise<ActivateDtoResponse> {
        try {
            const user = (await userProfileService.activate(body.token, body.data)) as UserDto;
            this.setCookie(req, user);
            this.setStatus(200);
            return { user };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * @summary Déconnexion de l'utilisateur courant
     */
    @Get("/logout")
    @Security("jwt")
    public async logout(@Request() req: IdentifiedRequest): Promise<string | null> {
        let url: null | string = null;
        if (!req.user) throw new BadRequestError();
        try {
            url = await userProConnectService.getLogoutUrl(new UserEntity(req.user as UserEntity));
        } catch {
            url = null;
        }
        await userAuthService.logout(new UserEntity(req.user as UserEntity));
        req.res?.clearCookie("token", this.getCookieOption());
        return url;
    }

    /**
     * @summary Valide un token d'activation ou de réinitialisation et retourne son type
     */
    @Example<TokenValidationDtoResponse>({ valid: true, type: TokenValidationType.SIGNUP })
    @Post("/validate-token")
    public async validateToken(@Body() body: { token?: string }): Promise<TokenValidationDtoResponse> {
        if (!body.token) throw new BadRequestError();

        return userActivationService.validateTokenAndGetType(body.token);
    }
}
