import type { GetRolesDtoResponse, UpdatableUser, UserDataDto, UserDto, UserDtoResponse } from "dto";
import type { IdentifiedRequest } from "../../../@types";

import { Route, Controller, Tags, Body, Security, Put, Request, Get, Delete, Response, Patch, Example } from "tsoa";
import { NotFoundError, HttpErrorInterface } from "core";
import userAuthService from "../../../modules/user/services/auth/user.auth.service";
import userRolesService from "../../../modules/user/services/roles/user.roles.service";
import userRgpdService from "../../../modules/user/services/rgpd/user.rgpd.service";
import userProfileService from "../../../modules/user/services/profile/user.profile.service";
import userCrudService from "../../../modules/user/services/crud/user.crud.service";
import { USER_DTO_DEFAULT, USER_DTO_LOGGED } from "./examples/Users";

@Route("user")
@Tags("User Controller")
@Security("jwt")
export class UserHttp extends Controller {
    /**
     * @summary Rôles de l'utilisateur courant
     */
    @Example<GetRolesDtoResponse>({ roles: ["user"] })
    @Get("/roles")
    @Security("jwt", ["user"])
    public async getRoles(@Request() req: IdentifiedRequest): Promise<GetRolesDtoResponse> {
        return { roles: await userRolesService.getRoles(req.user) };
    }

    /**
     * @summary Mise à jour du mot de passe
     */
    @Example<UserDtoResponse>({
        user: USER_DTO_DEFAULT,
    })
    @Put("/password")
    @Response<HttpErrorInterface>(400, "Bad Request")
    public async changePassword(
        @Request() req: IdentifiedRequest,
        @Body() body: { password: string },
    ): Promise<UserDtoResponse> {
        return await userAuthService.updatePassword(req.user, body.password);
    }

    /**
     * @summary Suppression du compte courant
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
     * @summary Informations du compte courant
     */
    @Example<UserDto>(USER_DTO_DEFAULT)
    @Get("/me")
    @Security("jwt", ["user"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    public getSelfUser(@Request() req: IdentifiedRequest): Promise<UserDto> {
        return userCrudService.getUserWithoutSecret(req.user.email);
    }

    /**
     * @summary Mise à jour du profil courant
     */
    @Example<UserDto>(USER_DTO_LOGGED)
    @Patch("/")
    @Security("jwt", ["user"])
    @Response<HttpErrorInterface>(400, "Bad Request")
    public updateProfile(@Request() req: IdentifiedRequest, @Body() body: Partial<UpdatableUser>): Promise<UserDto> {
        return userProfileService.profileUpdate(req.user, body);
    }

    /**
     * @summary Données personnelles de l'utilisateur courant
     */
    @Example<UserDataDto>({
        user: USER_DTO_DEFAULT,
        tokens: [
            // @ts-expect-error: no object id in dto
            { userId: "string", token: "string", createdAt: new Date("2023-10-03") },
        ],
        logs: [
            {
                req: {
                    user: USER_DTO_DEFAULT,
                    url: "https://datasubvention/association/100000001",
                    method: "GET",
                    httpVersion: "1.1",
                    originalUrl: "https://datasubvention/association/100000001",
                    query: {},
                    headers: {},
                },
                res: {},
                responseTime: 500,
            },
        ],
        statistics: {
            associationVisit: [
                { associationIdentifier: "10000000000018", userId: "string", date: new Date("2025-12-03") },
            ],
        },
    })
    @Get("/data")
    @Security("jwt", ["user"])
    public async getData(@Request() req: IdentifiedRequest): Promise<UserDataDto> {
        return userRgpdService.getAllData(req.user._id.toString());
    }
}
