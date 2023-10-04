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
import userService from "../../user.service";
import { IdentifiedRequest, LoginRequest } from "../../../../@types";
import { BadRequestError, InternalServerError } from "../../../../shared/errors/httpErrors";
import userAuthService from "../../services/auth/user.auth.service";
import userProfileService from "../../services/profile/user.profile.service";

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationController extends Controller {
    @Post("/forget-password")
    public async forgetPassword(@Body() body: { email: string }): Promise<{ success: boolean }> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await userService.forgetPassword(body.email.toLocaleLowerCase());
        return { success: true };
    }

    @Post("/reset-password")
    public async resetPassword(@Body() body: { password: string; token: string }): Promise<ResetPasswordDtoResponse> {
        const user = await userService.resetPassword(body.password, body.token);

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
        const user = await userService.signup(formatedBody);
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

        return userService.validateTokenAndGetType(body.token);
    }
}
