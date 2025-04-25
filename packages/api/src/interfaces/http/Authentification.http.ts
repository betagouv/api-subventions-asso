import type { CookieOptions } from "express";
import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security } from "tsoa";
import {
    FutureUserDto,
    UserActivationInfoDto,
    LoginDtoResponse,
    ResetPasswordDtoResponse,
    SignupDtoResponse,
    TokenValidationDtoResponse,
    ActivateDtoResponse,
} from "dto";
import { BadRequestError, InternalServerError } from "core";
import { IdentifiedRequest, LoginRequest } from "../../@types";
import userAuthService from "../../modules/user/services/auth/user.auth.service";
import userProfileService from "../../modules/user/services/profile/user.profile.service";
import userActivationService from "../../modules/user/services/activation/user.activation.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import { DOMAIN } from "../../configurations/domain.conf";
import { DEV } from "../../configurations/env.conf";
import userAgentConnectService from "../../modules/user/services/agentConnect/user.agentConnect.service";
import { AGENT_CONNECT_ENABLED } from "../../configurations/agentConnect.conf";

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationHttp extends Controller {
    private setCookie(req, user) {
        const cookieOption: CookieOptions = {
            secure: true,
            sameSite: "strict",
            domain: DOMAIN,
            expires: user.jwt.expirateDate,
            httpOnly: true,
        };

        if (DEV) {
            cookieOption.domain = undefined;
            cookieOption.secure = false;
            cookieOption.sameSite = "lax";
        }

        req.res?.cookie("token", user.jwt.token, cookieOption);
    }

    @Post("/forget-password")
    public async forgetPassword(@Body() body: { email: string }): Promise<{ success: boolean }> {
        await userActivationService.forgetPassword(body.email.toLocaleLowerCase());
        return { success: true };
    }

    @Post("/reset-password")
    public async resetPassword(
        @Body() body: { password: string; token: string },
        @Request() req,
    ): Promise<ResetPasswordDtoResponse> {
        const user = await userActivationService.resetPassword(body.password, body.token);
        this.setCookie(req, user);
        return { user };
    }

    private _login(req) {
        if (req.user) {
            this.setCookie(req, req.user);
            return { user: req.user };
        }

        throw new InternalServerError();
    }

    @Post("/login")
    @SuccessResponse("200", "Login successfully")
    public login(
        @Body() _body: { email: string; password: string }, // For docs and validation
        @Request() req: LoginRequest,
    ): LoginDtoResponse {
        // If you change the route please change in express.auth.hooks.ts
        return this._login(req);
    }

    @Get("/ac/login")
    @SuccessResponse("200", "Login successfully")
    public agentConnectLogin(@Request() req: Request): LoginDtoResponse {
        // If you change the route please change in express.auth.hooks.ts
        return this._login(req);
    }

    @Post("/activate")
    @SuccessResponse("200", "Account activation successfully")
    public async activate(
        @Body() body: { token: string; data: UserActivationInfoDto },
        @Request() req,
    ): Promise<ActivateDtoResponse> {
        const user = await userProfileService.activate(body.token, body.data);
        this.setCookie(req, user);
        this.setStatus(200);
        return { user };
    }

    @Get("/logout")
    @Security("jwt")
    public async logout(@Request() req: IdentifiedRequest): Promise<string | null> {
        let url: null | string = null;
        if (!req.user) throw new BadRequestError();
        if (AGENT_CONNECT_ENABLED) url = await userAgentConnectService.getLogoutUrl(req.user);
        await userAuthService.logout(req.user);
        return url;
    }

    @Post("/validate-token")
    public async validateToken(@Body() body: { token?: string }): Promise<TokenValidationDtoResponse> {
        if (!body.token) throw new BadRequestError();

        return userActivationService.validateTokenAndGetType(body.token);
    }
}
