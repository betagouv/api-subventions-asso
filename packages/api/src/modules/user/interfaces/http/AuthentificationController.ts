import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security } from "tsoa";
import {
    FutureUserDto,
    LoginDtoResponse,
    ResetPasswordDtoResponse,
    SignupDtoResponse,
} from "@api-subventions-asso/dto";
import userService from "../../user.service";
import { IdentifiedRequest, LoginRequest } from "../../../../@types";
import { BadRequestError, InternalServerError } from "../../../../shared/errors/httpErrors";

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationController extends Controller {
    @Post("/forget-password")
    public async forgetPassword(@Body() body: { email: string }): Promise<{ success: boolean }> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await userService.forgetPassword(body.email);
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
        const user = await userService.signup(body);
        this.setStatus(201);
        return { user };
    }

    @Get("/logout")
    @Security("jwt")
    public async logout(@Request() req: IdentifiedRequest) {
        if (!req.user) throw new BadRequestError();
        await userService.logout(req.user);
    }
}
