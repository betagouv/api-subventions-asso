import {
    CreateUserDtoResponse,
    FutureUserDto,
    GetRolesDtoResponse,
    UpdatableUser,
    UserDataDto,
    UserDto,
    UserDtoResponse,
    UserListDtoResponse,
} from "dto";
import { Route, Controller, Tags, Post, Body, Security, Put, Request, Get, Delete, Path, Response, Patch } from "tsoa";
import { RoleEnum } from "../../@enums/Roles";
import { IdentifiedRequest } from "../../@types";
import { BadRequestError, NotFoundError } from "../../shared/errors/httpErrors";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
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
     * Update user roles
     * @summary Update user's roles
     */
    @Post("/admin/roles")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>(400, "Role Not Valid")
    public async upgradeUserRoles(@Body() body: { email: string; roles: RoleEnum[] }): Promise<UserDtoResponse> {
        return await userRolesService.addRolesToUser(body.email, body.roles);
    }

    /**
     * Return the list of all users
     * @summary List all users
     */
    @Get("/admin/list-users")
    @Security("jwt", ["admin"])
    public async listUsers(): Promise<UserListDtoResponse> {
        return {
            users: await userCrudService.listUsers(),
        };
    }

    /**
     * Create a new user and send a mail to create a new password
     * @summary Create user
     */
    @Post("/admin/create-user")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    @Response<HttpErrorInterface>(409, "Unprocessable Entity")
    public async createUser(@Body() body: FutureUserDto): Promise<CreateUserDtoResponse> {
        const formatedBody = {
            ...body,
            email: body.email.toLocaleLowerCase(),
        };
        const user = await userCrudService.signup(formatedBody);
        this.setStatus(201);
        return { user };
    }

    /**
     * Remove a user
     * @summary Remove user
     */
    @Delete("/admin/user/:id")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    public async deleteUser(@Request() req: IdentifiedRequest, @Path() id: string): Promise<boolean> {
        if (!id) throw new BadRequestError("User ID is not defined");

        if (req.user._id.toString() === id) {
            throw new BadRequestError("Cannot delete its own account");
        }

        return await userCrudService.delete(id);
    }

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
