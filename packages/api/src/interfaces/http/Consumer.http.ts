import { ConsumerTokenDtoPositiveResponse, ConsumerTokenDtoResponse, UserDto } from "dto";
import { Controller, Get, Route, Security, Tags, Response, Request, Post, Body } from "tsoa";
import { RoleEnum } from "../../@enums/Roles";
import { IdentifiedRequest } from "../../@types";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import userConsumerService from "../../modules/user/services/consumer/user.consumer.service";
import userCrudService from "../../modules/user/services/crud/user.crud.service";

@Route("consumer")
@Tags("Consumer Controller")
@Security("jwt", [RoleEnum.consumer])
export class ConsumerHttp extends Controller {
    /**
     * Permet de récupérer votre token unique d'authentification.
     * Seul les utilisateurs qui ont le rôle CONSUMER peuvent appeler cette route.
     *
     * @summary Permet de récupérer votre token unique d'authentification
     */
    @Get("token")
    @Security("jwt", ["consumer"])
    @Response<ConsumerTokenDtoPositiveResponse>(200, "Retourne votre token d'authentification unique")
    @Response<HttpErrorInterface>(404, "Aucun token d'authentification n'a été trouvé")
    @Response<HttpErrorInterface>(401, "L'utilisateur n'a pas le rôle CONSUMER")
    public async getToken(@Request() req: IdentifiedRequest): Promise<ConsumerTokenDtoResponse> {
        const token = await userConsumerService.findConsumerToken(req.user._id);
        return { token };
    }

    /**
     * Permet à un admin de créer un nouveau compte consommateur
     *
     * @summary Permet de créer un nouveau compte consommateur
     */
    @Post("")
    @Security("jwt", ["admin"])
    @Response<UserDto>(200, "Retourne l'utilisateur créé")
    create(@Body() { email }: { email: string }): Promise<UserDto> {
        return userCrudService.signup({ email: email.toLocaleLowerCase() }, RoleEnum.consumer);
    }
}
