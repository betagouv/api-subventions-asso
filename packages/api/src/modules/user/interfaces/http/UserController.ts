import { ChangePasswordDtoResponse, GetRolesDtoResponse } from "@api-subventions-asso/dto";
import { Route, Controller, Tags, Post, Body, Security, Put, Request, Get, Delete, Path, Response } from 'tsoa';
import { IdentifiedRequest } from "../../../../@types/ApiRequests";
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

    @Get("/admin/list-users")
    @Security("jwt", ['admin'])
    public async listUsers() {
        const result = await userService.listUsers();

        if (!result.success) {
            this.setStatus(500);
        }
        return result;
    }

    @Post("/admin/create-user")
    @Security("jwt", ['admin'])
    public async createUser(
        @Body() body: { email: string },
    ): Promise<{ success: boolean, email: string }> {
        const result = await userService.createUsersByList([body.email]);

        if (!result[0].success) {
            this.setStatus(500);
        }
        return result[0];
    }

    @Delete("/admin/user/:id")
    @Security("jwt", ['admin'])
    @Response(204, "Retourne true si l'opération s'est bien exécutée", { success: true })
    @Response(500, "Retourne false si une erreur est survenue pendant l'exécution", { success: false })
    public async deleteUser(
        @Request() req: IdentifiedRequest,
        @Path() id: string
    ): Promise<{ success: boolean }> {

        if (!req.user || req.user?._id.toString() === id) {
            this.setStatus(500);
            return { success: false };
        }

        const result = await userService.delete(req.user);

        if (!result.success) {
            this.setStatus(500);
        }
        else {
            this.setStatus(204)
        }
        return result;
    }


    @Get("/roles")
    @Security("jwt", ['user'])
    @Response(200, "Retourne un tableau de rôles")
    public async getRoles(
        @Request() req: IdentifiedRequest
    ): Promise<GetRolesDtoResponse> {
        const roles = userService.getRoles(req.user);

        if (!roles) {
            this.setStatus(500);
            return {
                success: false,
                message: "Une erreur est survenue lors de l'accès à la base de donnée"
            }
        }

        return {
            success: true,
            roles
        };
    }

    @Put("/password")
    public async changePassword(
        @Request() req: IdentifiedRequest,
        @Body() body: { password: string }
    ): Promise<ChangePasswordDtoResponse> {
        const result = await userService.updatePassword(req.user, body.password);

        if (!result.success) {
            this.setStatus(500);
        }

        return result;
    }
}
