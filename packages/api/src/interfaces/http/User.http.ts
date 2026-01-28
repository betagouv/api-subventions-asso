import type { GetRolesDtoResponse, UpdatableUser, UserDataDto, UserDto, UserDtoResponse } from "dto";
import type { IdentifiedRequest } from "../../@types";

import { Route, Controller, Tags, Body, Security, Put, Request, Get, Delete, Response, Patch } from "tsoa";
import { NotFoundError, HttpErrorInterface } from "core";
import userAuthService from "../../modules/user/services/auth/user.auth.service";
import userRolesService from "../../modules/user/services/roles/user.roles.service";
import userRgpdService from "../../modules/user/services/rgpd/user.rgpd.service";
import userProfileService from "../../modules/user/services/profile/user.profile.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";

@Route("user")
@Tags("User Controller")
@Security("jwt")
export class UserHttp extends Controller {
    /**
     * Return user roles
     * @summary List user's roles
     */
    @Get("/roles")
    @Security("jwt", ["user"])
    public async getRoles(@Request() req: IdentifiedRequest): Promise<GetRolesDtoResponse> {
        return { roles: await userRolesService.getRoles(req.user) };
    }

    /**
     * Update user password
     * @summary Update password
     */
    @Put("/password")
    @Response<HttpErrorInterface>(400, "Bad Request")
    public async changePassword(
        @Request() req: IdentifiedRequest,
        @Body() body: { password: string },
    ): Promise<UserDtoResponse> {
        return await userAuthService.updatePassword(req.user, body.password);
    }

    /**
     * delete own's account
     * @summary delete own's account
     */
    @Delete("/")
    @Security("jwt", ["user"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    public async deleteSelfUser(@Request() req: IdentifiedRequest): Promise<boolean> {
        const success = await userRgpdService.disableById(req.user._id.toString());
        if (!success) throw new NotFoundError("user to delete not found");
        this.setStatus(204);
        return true;
    }

    /**
     * get own's account
     * @summary get own's account
     */
    @Get("/me")
    @Security("jwt", ["user"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    public getSelfUser(@Request() req: IdentifiedRequest): Promise<UserDto> {
        return userCrudService.getUserWithoutSecret(req.user.email);
    }

    /**
     * update own's account
     * @summary update own's account
     */
    @Patch("/")
    @Security("jwt", ["user"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    public updateProfile(@Request() req: IdentifiedRequest, @Body() body: Partial<UpdatableUser>): Promise<UserDto> {
        return userProfileService.profileUpdate(req.user, body);
    }

    /**
     * getting all data of user
     * @summary getting all data of user
     */
    @Get("/data")
    @Security("jwt", ["user"])
    public async getData(@Request() req: IdentifiedRequest): Promise<UserDataDto> {
        return userRgpdService.getAllData(req.user._id.toString());
    }
}
