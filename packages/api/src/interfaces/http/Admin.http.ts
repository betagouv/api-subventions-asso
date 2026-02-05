import { CreateUserDtoResponse, FutureUserDto, UserDtoResponse, UserListDtoResponse } from "dto";
import { Route, Controller, Tags, Post, Body, Security, Request, Get, Delete, Path, Response } from "tsoa";
import { BadRequestError, HttpErrorInterface } from "core";
import { RoleEnum } from "../../@enums/Roles";
import { IdentifiedRequest } from "../../@types";
import userRolesService from "../../modules/user/services/roles/user.roles.service";
import userRgpdService from "../../modules/user/services/rgpd/user.rgpd.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import statsService from "../../modules/stats/stats.service";

@Route("admin")
@Tags("Admin Controller")
@Security("jwt", ["admin"])
export class AdminHttp extends Controller {
    /**
     * Update user roles
     * @summary Update user's roles
     */
    @Post("/user/roles")
    @Response<HttpErrorInterface>(400, "Role Not Valid")
    public async upgradeUserRoles(@Body() body: { email: string; roles: RoleEnum[] }): Promise<UserDtoResponse> {
        return await userRolesService.addRolesToUser(body.email, body.roles);
    }

    /**
     * Return the list of all users
     * @summary List all users
     */
    @Get("/user/list-users")
    public async listUsers(): Promise<UserListDtoResponse> {
        return {
            users: await userCrudService.listUsers(),
        };
    }

    /**
     * Create a new user and send a mail to create a new password
     * @summary Create user
     */
    @Post("/user/create-user")
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
    @Delete("/user/:id")
    @Response<HttpErrorInterface>(400, "Bad Request")
    public async deleteUser(@Request() req: IdentifiedRequest, @Path() id: string): Promise<boolean> {
        if (!id) throw new BadRequestError("User ID is not defined");

        if (req.user._id.toString() === id) {
            throw new BadRequestError("Cannot delete its own account");
        }

        return await userRgpdService.disableById(id, false);
    }

    /**
     *
     * @param year
     * @returns
     */
    @Get("/stats/:year")
    public async getDetailedStats(@Path() year: string = new Date().getFullYear().toString()) {
        return await statsService.doStuff(year);
    }
}
