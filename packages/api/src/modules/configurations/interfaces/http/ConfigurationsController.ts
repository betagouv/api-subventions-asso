import { AddEmailDomainDto, GetEmailDomainsDto, ErrorResponse } from "@api-subventions-asso/dto";
import { Controller, Get, Post, Route, Security, Tags, Response, Body, SuccessResponse } from "tsoa";
import configurationsService from "../../configurations.service";

@Route("/config")
@Security("jwt", ["admin"])
@Tags("Configurations Controller")
export class ConfigurationsController extends Controller {
    /**
     * @summary Ajoute un nom de domaine d'adresse e-mail
     * @param domain String nom du domaine (ex @rhone.fr ou rhone.fr)
     * @returns {AddEmailDomainDto}
     */
    @Post("/domain")
    @SuccessResponse("201", "Created")
    @Response<ErrorResponse>(500, "Internal Server Error", {
        success: false,
        message: "Internal Server Error"
    })
    public async addDomain(@Body() body: { domain: string }): Promise<AddEmailDomainDto> {
        const persistedDomain = await configurationsService.addEmailDomain(body.domain);
        this.setStatus(201);
        return { success: true, domain: persistedDomain };
    }

    /**
     * @summary Liste les noms de domaine authorisés
     * @returns {GetEmailDomainsDto}
     */
    @Get("/domains")
    @Response<ErrorResponse>(500, "Internal Server Error", {
        success: false,
        message: "Internal Server Error"
    })
    public async getDomains(): Promise<GetEmailDomainsDto> {
        const domains = await configurationsService.getEmailDomains();
        return { success: true, domains };
    }
}
