import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security, } from 'tsoa';
import { Request as ExRequest } from "express";
import userService, { UserServiceErrors } from '../../user.service';
import User, { UserWithoutSecret } from '../../entities/User';
import { LoginDtoResponse, ResetPasswordDtoResponse, ResetPasswordErrorCodes, SignupDtoResponse, SignupErrorCodes } from "@api-subventions-asso/dto"

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationController extends Controller {

    @Post("/forget-password")
    public async forgetPassword(
        @Body() body: { email: string }
    ) {
        const result = await userService.forgetPassword(body.email);

        if (result.success) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {token: _token, ...reset } = result.reset;
            return { success: true, reset };
        }

        this.setStatus(500);

        return result
    }

    @Post("/reset-password")
    public async resetPassword(
        @Body() body: {
            password: string,
            token: string,
        }
    ): Promise<ResetPasswordDtoResponse> {
        const result = await userService.resetPassword(body.password, body.token);

        if (!result.success) {
            this.setStatus(500);

            let errorCode = ResetPasswordErrorCodes.INTERNAL_ERROR;

            switch (result.code) {
            case UserServiceErrors.RESET_TOKEN_NOT_FOUND:
                errorCode = ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND
                break;
            case UserServiceErrors.RESET_TOKEN_EXPIRED:
                errorCode = ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED
                break;
            case UserServiceErrors.USER_NOT_FOUND:
                errorCode = ResetPasswordErrorCodes.USER_NOT_FOUND
                break;            
            case UserServiceErrors.FORMAT_PASSWORD_INVALID:
                errorCode = ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID
                break;            
            }

            return {
                success: false,
                data: {
                    message: result.message,
                    code: errorCode
                }
            }
        }

        return {
            success: result.success,
            data: {
                user: { ...result.user, _id: result.user._id.toString()}
            }
        }
    }

    @Post("/login")
    @SuccessResponse("201", "Login successfully")
    public login(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() body: { email: string, password: string }, // Just for docs
        @Request() req: ExRequest
    ): LoginDtoResponse {
        // This metod is call after passport hook
        // If passport hook not valid, method is not call
        // If you change the route please change in express.auth.hooks.ts

        return (req.user as User).jwt;
    }

    @Post("/signup")
    @SuccessResponse("201", "Signup successfully")
    public async signup(
        @Body() body: { email: string },
    ): Promise<SignupDtoResponse> {
        const result = await userService.signup(body.email);

        if (result.success) {
            this.setStatus(201);
            return {
                success: true,
                data: {
                    message: `The user ${body.email}, is succefully created`
                }
            }
        }

        let errorCode: SignupErrorCodes = SignupErrorCodes.CREATION_ERROR;

        const internalServerError = [SignupErrorCodes.CREATION_ERROR, SignupErrorCodes.CREATION_RESET_ERROR];

        if (result.code === UserServiceErrors.CREATE_INVALID_EMAIL) errorCode = SignupErrorCodes.EMAIL_NOT_VALID;
        if (result.code === UserServiceErrors.CREATE_USER_ALREADY_EXIST) errorCode = SignupErrorCodes.USER_ALREADY_EXIST;
        if (result.code === UserServiceErrors.CREATE_USER_WRONG) errorCode = SignupErrorCodes.CREATION_ERROR;
        if (result.code === UserServiceErrors.CREATE_RESET_PASSWORD_WRONG) errorCode = SignupErrorCodes.CREATION_RESET_ERROR;
        if (result.code === UserServiceErrors.CREATE_EMAIL_GOUV) errorCode = SignupErrorCodes.EMAIL_MUST_BE_END_GOUV;

        this.setStatus(internalServerError.includes(errorCode) ? 500 : 422);

        return {
            success: false,
            data: {
                errorCode,
                message: result.message
            }
        }
    }

    @Get("/logout")
    @Security("jwt")
    public async logout(
        @Request() req: ExRequest
    ) {
        await userService.logout(req.user as UserWithoutSecret);

        return { success: true };
    }
}
