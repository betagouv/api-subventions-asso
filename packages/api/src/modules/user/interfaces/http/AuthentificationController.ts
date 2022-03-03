import { Route, Controller, Tags, Post, Body, SuccessResponse, Request, Get, Security, } from 'tsoa';
import { Request as ExRequest } from "express";
import userService from '../../user.service';
import User, { UserWithoutSecret } from '../../entities/User';

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
    ) {
        const result = await userService.resetPassword(body.password, body.token);

        if (!result.success) {
            this.setStatus(500);
        }
        return result
    }

    @Post("/login")
    @SuccessResponse("201", "Login successfully")
    public login(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() body: { email: string, password: string }, // Just for docs
        @Request() req: ExRequest
    ): { token: string, expirateDate: Date } {
        // This metod is call after passport hook
        // If passport hook not valid, method is not call
        // If you change the route please change in express.auth.hooks.ts

        return (req.user as User).jwt;
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
