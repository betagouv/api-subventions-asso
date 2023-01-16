import {
    ConsumerTokenDtoNegativeResponse,
    ConsumerTokenDtoPositiveResponse,
    ConsumerTokenDtoResponse
} from "@api-subventions-asso/dto";
import { Controller, Get, Route, Security, Tags, Response, Request } from "tsoa";
import { RoleEnum } from "../../../../@enums/Roles";
import { IdentifiedRequest } from "../../../../@types";
import userService from "../../user.service";

@Route("consumer")
@Tags("Consumer Controller")
@Security("jwt", [RoleEnum.consumer])
export class ConsumerController extends Controller {
    /**
     * Permet de récupérer votre token unique d'authentification.
     * Seul les utilisateurs qui ont le rôle CONSUMER peuvent appeler cette route.
     *
     * @summary Permet de récupérer votre token unique d'authentification
     */
    @Get("token")
    @Response<ConsumerTokenDtoPositiveResponse>(200, "Retourne votre token d'authentification unique", {
        success: true,
        token: "VOTRE TOKEN"
    })
    @Response<ConsumerTokenDtoNegativeResponse>(422, "Aucun token d'authentification n'a été trouvé", {
        success: false,
        message: "Aucun token d'authentification n'a été trouvé"
    })
    @Response<ConsumerTokenDtoNegativeResponse>(401, "L'utilisateur n'a pas le rôle CONSUMER", {
        success: false,
        message: "JWT does not contain required scope."
    })
    public async getToken(@Request() req: IdentifiedRequest): Promise<ConsumerTokenDtoResponse> {
        let token: string | undefined;
        try {
            token = await userService.findConsumerToken(req.user._id);
        } catch {
            /** Token not found */
        }

        if (!token) {
            this.setStatus(422);
            return {
                success: false,
                message: "Aucun token d'authentification n'a été trouvé"
            };
        }

        return { success: true, token };
    }
}
