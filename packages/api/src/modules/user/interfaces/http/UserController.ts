import { CreateUserDtoResponse, GetRolesDtoResponse, UserDtoErrorResponse, UserDtoResponse, UserErrorCodes, UserListDtoResponse } from "@api-subventions-asso/dto";
import { Route, Controller, Tags, Post, Body, Security, Put, Request, Get, Delete, Path, Response } from 'tsoa';
import { RoleEnum } from "../../../../@enums/Roles";
import { ValidateErrorJSON } from "../../../../@types";
import { IdentifiedRequest } from "../../../../@types/ApiRequests";
import userService, { UserServiceErrors } from '../../user.service';


// TODO: make this a class or something generic for all Controller ?
const USER_INTERNAL_SERVER_ERROR: UserDtoErrorResponse = {
    success: false,
    message: "Internal Server Error",
    errorCode: UserErrorCodes.INTERNAL_ERROR
}

// TODO: make this a class or something generic for all Controller ?
const USER_BAD_REQUEST: UserDtoErrorResponse = { success: false, message: "Bad Request", errorCode: UserErrorCodes.BAD_REQUEST }

@Route("user")
@Tags("User Controller")
@Security("jwt")
export class UserController extends Controller {

    /**
     * Update user roles
     * @summary Update user's roles
     */
    @Post("/admin/roles")
    @Security("jwt", ['admin'])
    @Response<ValidateErrorJSON>(400, "Role Not Valid")
    @Response<UserDtoErrorResponse>(422, "User Not Found", { success: false, message: "User Not Found", errorCode: UserErrorCodes.USER_NOT_F0UND })
    @Response<UserDtoErrorResponse>(500, "Internal Server Error", USER_INTERNAL_SERVER_ERROR)
    public async upgradeUserRoles(
        @Body() body: { email: string, roles: RoleEnum[] },
    ): Promise<UserDtoResponse> {
        const result = await userService.addRolesToUser(body.email, body.roles);

        if (!result.success) {
            const error = { ...USER_INTERNAL_SERVER_ERROR };
            if (result.code === UserServiceErrors.USER_NOT_FOUND) {
                this.setStatus(422);
                error.message = "User Not Found";
                error.errorCode = UserErrorCodes.USER_NOT_F0UND;
            }
            else this.setStatus(500);
            return error;
        }

        return result
    }

    /**
     * Return the list of all users
     * @summary List all users
     */
    @Get("/admin/list-users")
    @Security("jwt", ['admin'])
    @Response<UserDtoErrorResponse>(500, "Internal Server Error", USER_INTERNAL_SERVER_ERROR)
    public async listUsers(): Promise<UserListDtoResponse> {
        const result = await userService.listUsers();

        if (!result.success) {
            this.setStatus(500);
            return USER_INTERNAL_SERVER_ERROR;
        }
        return result;
    }

    /**
     * Create a new user and send a mail to create a new password
     * @summary Create user
     */
    @Post("/admin/create-user")
    @Security("jwt", ['admin'])
    @Response<UserDtoErrorResponse>(500, "Internal Server Error")
    public async createUser(
        @Body() body: { email: string },
    ): Promise<CreateUserDtoResponse> {
        const result = await userService.createUsersByList([body.email]);

        if (!result[0].success) {
            this.setStatus(500);
            return USER_INTERNAL_SERVER_ERROR;
        }
        return result[0];
    }

    /**
     * Remove a user
     * @summary Remove user
     */
    @Delete("/admin/user/:id")
    @Security("jwt", ['admin'])
    @Response(400, "Bad Request", USER_BAD_REQUEST)
    @Response(500, "Internal Server Error", USER_INTERNAL_SERVER_ERROR)
    public async deleteUser(
        @Request() req: IdentifiedRequest,
        @Path() id: string
    ): Promise<{ success: boolean } | UserDtoErrorResponse> {

        if (!id || req.user._id.toString() === id) {
            this.setStatus(400);
            return USER_BAD_REQUEST;
        }

        const result = await userService.delete(id);

        if (!result.success) {
            this.setStatus(500);
            return USER_INTERNAL_SERVER_ERROR;
        }
        return result;
    }

    /**
     * Return user roles
     * @summary List user's roles
     */
    @Get("/roles")
    @Security("jwt", ['user'])
    @Response<UserDtoErrorResponse>(500, "Internal Server Error", USER_INTERNAL_SERVER_ERROR)
    @Response(200, "Retourne un tableau de rôles")
    public async getRoles(
        @Request() req: IdentifiedRequest
    ): Promise<GetRolesDtoResponse> {
        const roles = userService.getRoles(req.user);

        if (!roles) {
            this.setStatus(500);
            return USER_INTERNAL_SERVER_ERROR;
        }

        return {
            success: true,
            roles
        };
    }

    /**
     * Update user password
     * @summary Update password
     */
    @Put("/password")
    @Response<UserDtoErrorResponse>(500, "Internal Server Error", USER_INTERNAL_SERVER_ERROR)
    @Response<UserDtoErrorResponse>(400, "Validator Error", {
        success: false,
        message: "Password is not hard, please use this rules: At least one digit [0-9] At least one lowercase character [a-z] At least one uppercase character [A-Z] At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\] At least 8 characters in length, but no more than 32.",
        errorCode: UserErrorCodes.INVALID_PASSWORD
    })
    public async changePassword(
        @Request() req: IdentifiedRequest,
        @Body() body: { password: string }
    ): Promise<UserDtoResponse> {
        const result = await userService.updatePassword(req.user, body.password);

        if (!result.success) {
            if (result.code === UserServiceErrors.FORMAT_PASSWORD_INVALID) {
                this.setStatus(400)
                return {
                    success: false,
                    message: result.message,
                    errorCode: UserErrorCodes.INVALID_PASSWORD
                }
            }
            this.setStatus(500);
            return USER_INTERNAL_SERVER_ERROR
        }

        return result;
    }
}
