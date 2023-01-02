import { AddEmailDomainDto, ErrorResponse } from "@api-subventions-asso/dto";
import { Controller, Post, Route, Security, Tags, Response, Body, SuccessResponse } from "tsoa";
import emailDomainsService from "../../emailDomains.service";

@Route("/domain")
@Security("jwt", ["admin"])
@Tags("EmailDomain Controller")
export class EmailDomainsController extends Controller {
    /**
     *
     *
     * @summary Ajoute un nom de domaine d'adresse e-mail
     * @param domain String nom du domaine (ex @rhones.fr ou rhones.fr)
     * @returns {EmailDomainsResponse}
     */
    @Post()
    @SuccessResponse("201", "Created")
    @Response<ErrorResponse>(500, "Internal Server Error", {
        success: false,
        message: "Internal Server Error"
    })
    public async addDomain(@Body() body: { domain: string }): Promise<AddEmailDomainDto> {
        const persistedDomain = await emailDomainsService.add(body.domain);
        this.setStatus(201);
        return { success: true, domain: persistedDomain };
    }
}
