import type { CreateUserDtoResponse, FutureUserDto, UserDtoResponse, UserListDtoResponse } from "dto";
import type { IdentifiedRequest } from "../../@types";
import {
    Route,
    Controller,
    Tags,
    Post,
    Body,
    Security,
    Request,
    Get,
    Delete,
    Path,
    Response,
    Example,
    Hidden,
} from "tsoa";
import { BadRequestError, HttpErrorInterface } from "core";
import { RoleEnum } from "../../@enums/Roles";
import userRolesService from "../../modules/user/services/roles/user.roles.service";
import userRgpdService from "../../modules/user/services/rgpd/user.rgpd.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";
import statsService from "../../modules/stats/stats.service";
import { USER_DTO_ADMIN, USER_DTO_DEFAULT, USER_DTO_NEW } from "./examples/Users";

@Route("admin")
@Hidden()
@Tags("Admin Controller")
@Security("jwt", ["admin"])
export class AdminHttp extends Controller {
    /**
     * @summary Mise à jour des rôles d'un utilisateur
     */
    @Example<UserDtoResponse>({
        user: USER_DTO_ADMIN,
    })
    @Post("/user/roles")
    @Response<HttpErrorInterface>(400, "Role Not Valid")
    public async upgradeUserRoles(@Body() body: { email: string; roles: RoleEnum[] }): Promise<UserDtoResponse> {
        return await userRolesService.addRolesToUser(body.email, body.roles);
    }

    /**
     * @summary Liste de tous les utilisateurs
     */
    @Example<UserListDtoResponse>({
        users: [USER_DTO_DEFAULT],
    })
    @Get("/user/list-users")
    public async listUsers(): Promise<UserListDtoResponse> {
        return {
            users: await userCrudService.listUsers(),
        };
    }

    /**
     * @summary Création d'un utilisateur (envoie un e-mail d'activation)
     */
    @Example<CreateUserDtoResponse>({
        user: USER_DTO_NEW,
    })
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
     * @summary Suppression d'un utilisateur
     */
    @Example<boolean>(true)
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
     * @summary Statistiques de consommation par consommateur
     */
    @Get("/stats/consumers")
    public async getConsumersStats() {
        let result;
        try {
            result = await statsService.getConsumersConsumption();
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}
