import { AddEmailDomainDto, GetEmailDomainsDto, MainInfoBannerDto } from "dto";
import { Controller, Get, Post, Route, Security, Tags, Response, Body, SuccessResponse } from "tsoa";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import configurationsService from "../../modules/configurations/configurations.service";

@Route("/config")
@Security("jwt", ["admin"])
@Tags("Configurations Controller")
export class ConfigurationsHttp extends Controller {
    /**
     * @summary Ajoute un nom de domaine d'adresse e-mail
     * @param domain String nom du domaine (ex @rhone.fr ou rhone.fr)
     * @returns {AddEmailDomainDto}
     */
    @Post("/domains")
    @SuccessResponse("201", "Created")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async addDomain(@Body() body: { domain: string }): Promise<AddEmailDomainDto> {
        const persistedDomain = await configurationsService.addEmailDomain(body.domain);
        this.setStatus(201);
        return { domain: persistedDomain };
    }

    /**
     * @summary Liste les noms de domaine authorisés
     * @returns {GetEmailDomainsDto}
     */
    @Get("/domains")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async getDomains(): Promise<GetEmailDomainsDto> {
        const domains = await configurationsService.getEmailDomains();
        return { domains };
    }

    /**
     * @summary Modifie le bandeau d'informations de la homepage
     * @param title Titre du bandeau
     * @param desc Contenu du bandeau - en HTML
     * @returns {MainInfoBannerDto}
     */
    @Post("/main-info-banner")
    @SuccessResponse("201", "Updated")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async updateMainInfoBanner(@Body() body: { title?: string; desc?: string }): Promise<MainInfoBannerDto> {
        const banner = await configurationsService.updateMainInfoBanner(body.title, body.desc);
        this.setStatus(201);
        return banner;
    }

    /**
     * @summary Récupère les infos du bandeau d'informations de la homepage
     * @returns {MainInfoBannerDto}
     */
    @Get("/main-info-banner")
    @Response<HttpErrorInterface>(500, "Internal Server Error", {
        message: "Internal Server Error",
    })
    public async getMainInfoBanner(): Promise<MainInfoBannerDto> {
        const banner = await configurationsService.getMainInfoBanner();
        return banner;
    }
}
