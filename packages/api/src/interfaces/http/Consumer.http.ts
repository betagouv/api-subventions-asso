import { ConsumerTokenDtoPositiveResponse, ConsumerTokenDtoResponse } from "dto";
import { Controller, Get, Route, Security, Tags, Response, Request } from "tsoa";
import { RoleEnum } from "../../@enums/Roles";
import { IdentifiedRequest } from "../../@types";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import userConsumerService from "../../modules/user/services/consumer/user.consumer.service";

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
    @Response<ConsumerTokenDtoPositiveResponse>(200, "Retourne votre token d'authentification unique")
    @Response<HttpErrorInterface>(404, "Aucun token d'authentification n'a été trouvé")
    @Response<HttpErrorInterface>(401, "L'utilisateur n'a pas le rôle CONSUMER")
    public async getToken(@Request() req: IdentifiedRequest): Promise<ConsumerTokenDtoResponse> {
        const token = await userConsumerService.findConsumerToken(req.user._id);
        return { token };
    }
}
