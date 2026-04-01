import type { ConsumerTokenDtoPositiveResponse, ConsumerTokenDtoResponse, UserDto } from "dto";
import type { IdentifiedRequest } from "../../@types";

import { RoleEnum } from "../../@enums/Roles";
import { Controller, Get, Route, Security, Tags, Response, Request, Post, Body, Example, Hidden } from "tsoa";
import { HttpErrorInterface } from "core";
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
    @Example<ConsumerTokenDtoResponse>({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEifQ.signature",
    })
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
    @Example<{ user: UserDto }>({
        user: {
            _id: "507f1f77bcf86cd799439011" as unknown as UserDto["_id"],
            email: "consumer@api-example.fr",
            roles: ["consumer"],
            active: true,
            signupAt: "2024-01-15T00:00:00.000Z" as unknown as Date,
            profileToComplete: false,
            nbVisits: 0,
            lastActivityDate: null,
        } as UserDto,
    })
    @Post("")
    @Hidden()
    @Security("jwt", ["admin"])
    @Response<{ user: UserDto }>(200, "Retourne l'utilisateur créé")
    async create(@Body() { email }: { email: string }): Promise<{ user: UserDto }> {
        const user = await userCrudService.signup({ email: email.toLocaleLowerCase() }, RoleEnum.consumer);
        return { user };
    }
}
