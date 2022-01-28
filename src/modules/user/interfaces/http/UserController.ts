import { Route, Controller, Tags, Post, Body, Security, SuccessResponse } from 'tsoa';
import userService from '../../user.service';

@Route("user")
@Tags("User Controller")
export class UserController extends Controller {

    @Post("/admin/roles")
    @Security("jwt", ['admin'])
    public async upgradeUserRoles(
        @Body() body: { email: string, roles: string[] },
    ) {
        const result = await userService.addRolesToUser(body.email, body.roles);

        if (!result.success) {
            this.setStatus(500);
        }
        return result
    }

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
        @Body() body: { email: string, password: string }
    ): { token: string, expirateDate: Date } {
        console.info("THIS METHOD is never call, it's just for docs please read express.auth.hooks.ts")

        return { token: "FAKE TOKEN", expirateDate: new Date()}
    }
}
