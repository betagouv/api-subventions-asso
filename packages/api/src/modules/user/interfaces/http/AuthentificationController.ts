import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security, Response } from "tsoa";
import userService, { UserServiceErrors } from "../../user.service";
import {
    LoginDtoErrorCodes,
    LoginDtoNegativeResponse,
    LoginDtoResponse,
    ResetPasswordDtoNegativeResponse,
    ResetPasswordDtoResponse,
    ResetPasswordErrorCodes,
    SignupDtoResponse,
    SignupErrorCodes
} from "@api-subventions-asso/dto";
import { DefaultObject, IdentifiedRequest, LoginRequest } from "../../../../@types";
import { BadRequestError, InternalServerError } from "../../../../shared/errors/httpErrors";

@Route("/auth")
@Tags("Authentification Controller")
export class AuthentificationController extends Controller {
    @Post("/forget-password")
    public async forgetPassword(@Body() body: { email: string }) {
        const result = await userService.forgetPassword(body.email);
        if (result.success) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { token: _token, ...reset } = result.reset;
            return { reset };
        }

        this.setStatus(500);

        return result;
    }

    @Post("/reset-password")
    @Response<ResetPasswordDtoNegativeResponse>("500")
    public async resetPassword(@Body() body: { password: string; token: string }): Promise<ResetPasswordDtoResponse> {
        const result = await userService.resetPassword(body.password, body.token);

        if (!result.success) {
            this.setStatus(500);

            let errorCode = ResetPasswordErrorCodes.INTERNAL_ERROR;

            switch (result.code) {
                case UserServiceErrors.RESET_TOKEN_NOT_FOUND:
                    errorCode = ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND;
                    break;
                case UserServiceErrors.RESET_TOKEN_EXPIRED:
                    errorCode = ResetPasswordErrorCodes.RESET_TOKEN_EXPIRED;
                    break;
                case UserServiceErrors.USER_NOT_FOUND:
                    errorCode = ResetPasswordErrorCodes.USER_NOT_FOUND;
                    break;
                case UserServiceErrors.FORMAT_PASSWORD_INVALID:
                    errorCode = ResetPasswordErrorCodes.PASSWORD_FORMAT_INVALID;
                    break;
            }

            return {
                message: result.message,
                code: errorCode
            };
        }

        return {
            user: { ...result.user, _id: result.user._id.toString() }
        };
    }

    @Post("/login")
    @SuccessResponse("201", "Login successfully")
    public login(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() body: { email: string; password: string }, // Just for docs
        @Request() req: LoginRequest
    ): LoginDtoResponse {
        // If you change the route please change in express.auth.hooks.ts

        if (req.user) {
            // Successfully logged
            this.setStatus(201);
            return {
                user: req.user
            };
        }

        const errorCode = parseInt(req.authInfo.message, 10);

        const errors: DefaultObject<{
            errorCode: LoginDtoErrorCodes;
            message: string;
        }> = {
            [UserServiceErrors.USER_NOT_FOUND]: {
                errorCode: LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH,
                message: "Email or password not match"
            },
            [UserServiceErrors.LOGIN_WRONG_PASSWORD_MATCH]: {
                errorCode: LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH,
                message: "Email or password not match"
            },
            [UserServiceErrors.USER_NOT_ACTIVE]: {
                errorCode: LoginDtoErrorCodes.USER_NOT_ACTIVE,
                message: "User is inactive"
            },
            [UserServiceErrors.LOGIN_UPDATE_JWT_FAIL]: {
                errorCode: LoginDtoErrorCodes.INTERNAL_ERROR,
                message: "Internal error, please try later"
            }
        };

        const result: LoginDtoNegativeResponse = errors[errorCode] || {
            errorCode: LoginDtoErrorCodes.INTERNAL_ERROR,
            message: "Internal error, please try later"
        };

        this.setStatus(401);
        return result;
    }

    @Post("/signup")
    @SuccessResponse("201", "Signup successfully")
    public async signup(@Body() body: { email: string }): Promise<SignupDtoResponse> {
        const result = await userService.signup(body.email);

        if (result.success) {
            this.setStatus(201);
            return {
                email: result.email
            };
        }

        const internalServerError = [SignupErrorCodes.CREATION_ERROR, SignupErrorCodes.CREATION_RESET_ERROR];

        const errorMatch: DefaultObject<SignupErrorCodes> = {
            [UserServiceErrors.CREATE_INVALID_EMAIL]: SignupErrorCodes.EMAIL_NOT_VALID,
            [UserServiceErrors.CREATE_USER_ALREADY_EXIST]: SignupErrorCodes.USER_ALREADY_EXIST,
            [UserServiceErrors.CREATE_USER_WRONG]: SignupErrorCodes.CREATION_ERROR,
            [UserServiceErrors.CREATE_RESET_PASSWORD_WRONG]: SignupErrorCodes.CREATION_RESET_ERROR,
            [UserServiceErrors.CREATE_EMAIL_GOUV]: SignupErrorCodes.EMAIL_MUST_BE_END_GOUV
        };

        const errorCode: SignupErrorCodes = errorMatch[result.code] || SignupErrorCodes.CREATION_ERROR;

        this.setStatus(internalServerError.includes(errorCode) ? 500 : 422);

        return {
            errorCode,
            message: result.message
        };
    }

    @Get("/logout")
    @Security("jwt")
    public async logout(@Request() req: IdentifiedRequest) {
        if (!req.user) throw new BadRequestError();
        await userService.logout(req.user);
    }
}
