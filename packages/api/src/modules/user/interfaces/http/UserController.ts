import {
    CreateUserDtoResponse,
    GetRolesDtoResponse,
    UserDtoResponse,
    UserListDtoResponse,
} from "@api-subventions-asso/dto";
import { Route, Controller, Tags, Post, Body, Security, Put, Request, Get, Delete, Path, Response } from "tsoa";
import { RoleEnum } from "../../../../@enums/Roles";
import { IdentifiedRequest } from "../../../../@types";
import { BadRequestError } from "../../../../shared/errors/httpErrors";
import { HttpErrorInterface } from "../../../../shared/errors/httpErrors/HttpError";
import userService from "../../user.service";

@Route("user")
@Tags("User Controller")
@Security("jwt")
export class UserController extends Controller {
    /**
     * Update user roles
     * @summary Update user's roles
     */
    @Post("/admin/roles")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>(400, "Role Not Valid")
    @Response<HttpErrorInterface>(422, "User Not Found")
    public async upgradeUserRoles(@Body() body: { email: string; roles: RoleEnum[] }): Promise<UserDtoResponse> {
        return await userService.addRolesToUser(body.email, body.roles);
    }

    /**
     * Return the list of all users
     * @summary List all users
     */
    @Get("/admin/list-users")
    @Security("jwt", ["admin"])
    public async listUsers(): Promise<UserListDtoResponse> {
        return await userService.listUsers();
    }

    /**
     * Create a new user and send a mail to create a new password
     * @summary Create user
     */
    @Post("/admin/create-user")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    @Response<HttpErrorInterface>(409, "Unprocessable Entity")
    public async createUser(@Body() body: { email: string }): Promise<CreateUserDtoResponse> {
        const email = await userService.signup(body.email);
        this.setStatus(201);
        return { email };
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

        return await userService.delete(id);
    }

    /**
     * Return user roles
     * @summary List user's roles
     */
    @Get("/roles")
    @Security("jwt", ["user"])
    public async getRoles(@Request() req: IdentifiedRequest): Promise<GetRolesDtoResponse> {
        return { roles: await userService.getRoles(req.user) };
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
        return await userService.updatePassword(req.user, body.password);
    }
}
