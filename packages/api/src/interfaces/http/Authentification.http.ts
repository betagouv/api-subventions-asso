import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security, Res } from "tsoa";
import {
    FutureUserDto,
    UserActivationInfoDto,
    LoginDtoResponse,
    ResetPasswordDtoResponse,
    SignupDtoResponse,
    TokenValidationDtoResponse,
    ActivateDtoResponse,
} from "dto";
import { IdentifiedRequest, LoginRequest } from "../../@types";
import { BadRequestError, InternalServerError } from "../../shared/errors/httpErrors";
import userAuthService from "../../modules/user/services/auth/user.auth.service";
import userProfileService from "../../modules/user/services/profile/user.profile.service";
import userActivationService from "../../modules/user/services/activation/user.activation.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import { DOMAIN } from "../../configurations/domain.conf";
import { JWT_EXPIRES_TIME } from "../../configurations/jwt.conf";

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationHttp extends Controller {
    @Post("/forget-password")
    public async forgetPassword(@Body() body: { email: string }): Promise<{ success: boolean }> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await userActivationService.forgetPassword(body.email.toLocaleLowerCase());
        return { success: true };
    }

    @Post("/reset-password")
    public async resetPassword(@Body() body: { password: string; token: string }): Promise<ResetPasswordDtoResponse> {
        const user = await userActivationService.resetPassword(body.password, body.token);

        return {
            user,
        };
    }

    @Post("/login")
    @SuccessResponse("200", "Login successfully")
    public login(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() body: { email: string; password: string }, // Just for docs
        @Request() req: LoginRequest,
    ): LoginDtoResponse {
        // If you change the route please change in express.auth.hooks.ts

        if (req.user) {
            // Successfully logged
            req.res?.cookie("token", req.user.jwt.token, {
                secure: true,
                sameSite: "none",
                domain: DOMAIN,
                expires: new Date(new Date().getTime() + JWT_EXPIRES_TIME),
                httpOnly: true,
            });
            return {
                user: req.user,
            };
        }

        throw new InternalServerError();
    }

    @Post("/signup")
    @SuccessResponse("201", "Signup successfully")
    public async signup(@Body() body: FutureUserDto): Promise<SignupDtoResponse> {
        const formatedBody = {
            ...body,
            email: body.email.toLocaleLowerCase(),
        };
        const user = await userCrudService.signup(formatedBody);
        this.setStatus(201);
        return { user };
    }

    @Post("/activate")
    @SuccessResponse("200", "Account activation successfully")
    public async activate(@Body() body: { token: string; data: UserActivationInfoDto }): Promise<ActivateDtoResponse> {
        const user = await userProfileService.activate(body.token, body.data);
        this.setStatus(200);
        return { user };
    }

    @Get("/logout")
    @Security("jwt")
    public async logout(@Request() req: IdentifiedRequest) {
        if (!req.user) throw new BadRequestError();
        await userAuthService.logout(req.user);
    }

    @Post("/validate-token")
    public async validateToken(@Body() body: { token?: string }): Promise<TokenValidationDtoResponse> {
        if (!body.token) throw new BadRequestError();

        return userActivationService.validateTokenAndGetType(body.token);
    }
}
