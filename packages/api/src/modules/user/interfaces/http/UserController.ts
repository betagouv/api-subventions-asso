import { Request as ExRequest } from 'express';
import { Route, Controller, Tags, Post, Body, Security, Put, Request } from 'tsoa';
import { UserWithoutSecret } from '../../entities/User';
import userService from '../../user.service';

@Route("user")
@Tags("User Controller")
@Security("jwt")
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

    @Put("/password")
    public async changePassword(
        @Request() req: ExRequest,
        @Body() body: { password: string }
    ) {
        const user = req.user as UserWithoutSecret;
        const result = await userService.updatePassword(user, body.password);

        if (!result.success) {
            this.setStatus(500);
        }
        return result;
    }
}
